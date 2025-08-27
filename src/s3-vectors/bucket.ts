import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IGrantable } from 'aws-cdk-lib/aws-iam';
import { IKey } from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as custom_resources from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';


export interface BucketProps {
  /**
    * The name of the vector bucket to create.
    */
  readonly vectorBucketName: string;

  /**
    * The encryption configuration for the vector bucket.
    *
    * By default, if you don't specify, all new vectors in Amazon S3 vector buckets use
    * server-side encryption with Amazon S3 managed keys (SSE-S3), specifically `AES256`.
    */
  readonly encryptionConfiguration?: EncryptionConfiguration;
}

export interface EncryptionConfiguration {
  /**
    * The server-side encryption type. Must be `AES256` or `aws:kms`.
    *
    * By default, if you don't specify, all new vectors in Amazon S3 vector buckets use
    * server-side encryption with Amazon S3 managed keys (SSE-S3), specifically `AES256`.
    */
  readonly sseType: 'AES256' | 'aws:kms';

  /**
   * The AWS Key Management Service (KMS) customer managed key to use for server-side encryption.
   *
   * This parameter is allowed if and **only** if `sseType` is set to `aws:kms`.
   */
  readonly kmsKey?: IKey;
}

/**
 * Amazon S3 Vectors is in preview release for Amazon S3 and is subject to change.
 *
 * Creates a vector bucket in the specified AWS Region.
 */
export class Bucket extends Construct {
  /**
    * The name of the vector bucket to create.
    */
  public readonly vectorBucketName: string;

  /**
   * The ARN (Amazon Resource Name) of the created S3 vector bucket.
   */
  public readonly vectorBucketArn: string;


  /**
    * @summary Creates a new Bucket construct for S3 Vectors.
    * @param {cdk.App} scope - Represents the scope for all resources.
    * @param {string} id - Scope-unique id.
    * @param {BucketProps} props - User provided props for the construct.
    * @access public
    */


  constructor(scope: Construct, id: string, props: BucketProps) {
    super(scope, id);

    const s3VectorsHandler = new lambda.Function(this, 'S3VectorsBucketHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 's3-vectors-create-bucket.handler',
      code: lambda.Code.fromAsset(__dirname + '/../lambda'),
      timeout: cdk.Duration.minutes(5),
    });

    s3VectorsHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3vectors:CreateVectorBucket'],
      resources: ['*'],
    }));

    const region = cdk.Stack.of(this).region;
    const accountId = cdk.Stack.of(this).account;
    const constructedVectorBucketArn = `arn:aws:s3vectors:${region}:${accountId}:bucket/${props.vectorBucketName}`;

    s3VectorsHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        's3vectors:DeleteVectorBucket',
        's3vectors:ListIndexes',
        's3vectors:DeleteIndex',
      ],
      resources: [constructedVectorBucketArn],
    }));

    // Add KMS permissions if encryption is configured
    if (props.encryptionConfiguration?.sseType === 'aws:kms') {
      if (!props.encryptionConfiguration.kmsKey) {
        throw new Error('A kmsKey object must be provided when sseType is set to aws:kms');
      }

      // Add resource policy to the key
      props.encryptionConfiguration.kmsKey.addToResourcePolicy(new iam.PolicyStatement({
        principals: [new iam.ServicePrincipal('indexing.s3vectors.amazonaws.com')],
        actions: [
          'kms:Decrypt',
          'kms:GenerateDataKey',
          'kms:DescribeKey',
        ],
        resources: ['*'],
      }));

      // Add policy to the Lambda's role
      s3VectorsHandler.addToRolePolicy(new iam.PolicyStatement({
        actions: [
          'kms:Decrypt',
          'kms:DescribeKey',
          'kms:GenerateDataKey',
        ],
        resources: [props.encryptionConfiguration.kmsKey.keyArn],
      }));
    }

    const s3VectorsProvider = new custom_resources.Provider(this, 'S3VectorsProvider', {
      onEventHandler: s3VectorsHandler,
    });

    const customResource = new cdk.CustomResource(this, 'VectorBucketCustomResource', {
      serviceToken: s3VectorsProvider.serviceToken,
      properties: {
        vectorBucketName: props.vectorBucketName,
        encryptionConfiguration: {
          sseType: props.encryptionConfiguration?.sseType,
          kmsKeyArn: props.encryptionConfiguration?.kmsKey?.keyArn,
        },
      },
    });

    this.vectorBucketName = customResource.getAttString('VectorBucketName');
    this.vectorBucketArn = customResource.getAttString('VectorBucketArn');
  }

  /**
    * Grants permissions to list indexes within this vector bucket.
    * @param grantee The principal to grant permissions to.
    */
  public grantListIndexes(grantee: IGrantable): void {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3vectors:ListIndexes'],
      resources: [this.vectorBucketArn],
    }));
  }
}