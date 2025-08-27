import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IGrantable } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as custom_resources from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';


export interface IndexProps {
  /**
    * The name of the vector bucket to create the vector index in.
    */
  readonly vectorBucketName: string;

  /**
    * The name of the vector index to create.
    */
  readonly indexName: string;

  /**
    * The data type of the vectors in the index. Must be 'float32'
    */
  readonly dataType: 'float32';

  /**
    * The dimensions of the vectors to be inserted into the vector index.
    */
  readonly dimension: number;

  /**
    * The distance metric to be used for similarity search.
    */
  readonly distanceMetric: 'euclidean' | 'cosine';

  /**
    * The metadata configuration for the vector index.
    */
  readonly metadataConfiguration?: MetadataConfiguration;
}

export interface MetadataConfiguration {
  /**
    * Non-filterable metadata keys allow you to enrich vectors with additional context during storage and retrieval.
    * Unlike default metadata keys, these keys can't be used as query filters.
    *
    * Non-filterable metadata keys can be retrieved but can't be searched, queried, or filtered.
    * You can access non-filterable metadata keys of your vectors after finding the vectors.
    * For more information about non-filterable metadata keys, see
    * [Vectors](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-vectors.html) and
    * [Limitations and restrictions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-limitations.html)
    * in the *Amazon S3 User Guide*.
    */
  readonly nonFilterableMetadataKeys: string[];
}

/**
 * Amazon S3 Vectors is in preview release for Amazon S3 and is subject to change.
 *
 * Creates a vector index within a vector bucket.
 * To specify the vector bucket, you must use either the vector bucket name or the vector bucket ARN (Amazon Resource Name).
 */
export class Index extends Construct {
  /**
    * The ARN (Amazon Resource Name) of the S3 Vector index.
    */
  public readonly indexArn: string;

  /**
   * The name of the index.
   */
  public readonly indexName: string;


  /**
    * @summary Creates a new Index construct for S3 Vectors.
    * @param {cdk.App} scope - Represents the scope for all resources.
    * @param {string} id - Scope-unique id.
    * @param {IndexProps} props - User provided props for the construct.
    * @access public
    */


  constructor(scope: Construct, id: string, props: IndexProps) {
    super(scope, id);
    if (props.dimension < 1 || props.dimension > 4096) {
      throw new Error('Dimension must be between 1 and 4096.');
    }

    const region = cdk.Stack.of(this).region;
    const accountId = cdk.Stack.of(this).account;
    const constructedIndexArn = `arn:aws:s3vectors:${region}:${accountId}:bucket/${props.vectorBucketName}/index/${props.indexName}`;

    const s3VectorsHandler = new lambda.Function(this, 'S3VectorsHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 's3-vectors-create-index.handler',
      code: lambda.Code.fromAsset(__dirname + '/../lambda'),
      timeout: cdk.Duration.minutes(5),
    });

    // Add all permissions upfront to avoid circular dependency
    s3VectorsHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3vectors:CreateIndex'],
      resources: [constructedIndexArn],
    }));

    s3VectorsHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3vectors:DeleteIndex'],
      resources: [constructedIndexArn],
    }));

    // Add KMS permissions for encrypted buckets
    s3VectorsHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'kms:Decrypt',
        'kms:DescribeKey',
        'kms:GenerateDataKey',
      ],
      resources: ['*'],
    }));

    const s3VectorsProvider = new custom_resources.Provider(this, 'S3VectorsProvider', {
      onEventHandler: s3VectorsHandler,
    });

    const customResource = new cdk.CustomResource(this, 'S3VectorIndexCustomResource', {
      serviceToken: s3VectorsProvider.serviceToken,
      properties: {
        physicalId: `${props.vectorBucketName}-${props.indexName}`,
        vectorBucketName: props.vectorBucketName,
        indexName: props.indexName,
        dataType: props.dataType,
        dimension: props.dimension,
        distanceMetric: props.distanceMetric,
        metadataConfiguration: props.metadataConfiguration,
      },
    });

    this.indexName = props.indexName;
    this.indexArn = customResource.getAttString('IndexArn');
  }

  /**
    * Grants write permissions (add/delete vectors) to the index.
    * @param grantee The principal to grant permissions to.
    */
  public grantWrite(grantee: IGrantable): void {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        's3vectors:PutVectors',
        's3vectors:DeleteVectors',
      ],
      resources: [this.indexArn],
    }));
  }
}