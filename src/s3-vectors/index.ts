import * as iam from 'aws-cdk-lib/aws-iam';
import { IGrantable } from 'aws-cdk-lib/aws-iam';
import * as custom_resources from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { Bucket } from './bucket';

export interface IndexProps {
  /**
    * The S3 Vector Bucket construct where the index will be created.
    */
  readonly bucket: Bucket;

  /**
    * The name of the vector index.
    */
  readonly indexName: string;

  /**
    * The data type of the vectors in the index.
    */
  readonly dataType: 'float32';

  /**
    * The number of dimensions for the vectors in the index.
    */
  readonly dimension: number;

  /**
    * The distance metric to use for calculating similarity.
    */
  readonly distanceMetric: 'euclidean' | 'cosine';

  /**
    * Optional metadata configuration for the index.
    */
  readonly metadataConfiguration?: MetadataConfiguration;
}

export interface MetadataConfiguration {
  /**
    * A list of keys for metadata fields that should not be filterable.
    */
  readonly nonFilterableMetadataKeys: string[];
}

export class Index extends Construct {
  /**
    * The ARN (Amazon Resource Name) of the created S3 Vector index.
    */
  public readonly indexArn: string;

  /**
   * The HTTPS endpoint for the S3 Vector index, used for making API calls.
   */
  public readonly indexEndpoint: string;

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

    const createParams: { [key: string]: any } = {
      vectorBucketName: props.bucket.bucketName,
      indexName: props.indexName,
      dataType: props.dataType,
      dimension: props.dimension,
      distanceMetric: props.distanceMetric,
    };

    if (props.metadataConfiguration) {
      createParams.metadataConfiguration = props.metadataConfiguration;
    }

    // Helper function to create a stable string representation of the metadata object
    const getStableMetadataString = (metadata?: MetadataConfiguration) => {
      if (!metadata || !metadata.nonFilterableMetadataKeys) {
        return '';
      }
      const sortedKeys = [...metadata.nonFilterableMetadataKeys].sort();
      return JSON.stringify({ nonFilterableMetadataKeys: sortedKeys });
    };

    const physicalResourceId = custom_resources.PhysicalResourceId.of(
      [
        props.indexName,
        props.dimension,
        props.dataType,
        props.distanceMetric,
        getStableMetadataString(props.metadataConfiguration),
      ].join('-'),
    );

    const onCreate: custom_resources.AwsSdkCall = {
      service: 'S3Vectors',
      action: 'createIndex',
      parameters: createParams,
      physicalResourceId: physicalResourceId,
      region: props.bucket.region,
    };

    const onDelete: custom_resources.AwsSdkCall = {
      service: 'S3Vectors',
      action: 'deleteIndex',
      parameters: {
        vectorBucketName: props.bucket.bucketName,
        indexName: props.indexName,
      },
      region: props.bucket.region,
    };

    const customResource = new custom_resources.AwsCustomResource(this, 'S3VectorIndexCustomResource', {
      onCreate: onCreate,
      onDelete: onDelete,
      policy: custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
        resources: custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    this.indexArn = customResource.getResponseField('IndexArn').toString();
    this.indexEndpoint = customResource.getResponseField('IndexEndpoint').toString();
    // Ensure the index is created only after the bucket has been created.
    customResource.node.addDependency(props.bucket);
  }

  /**
    * Grants write permissions (add/delete vectors) to the index.
    * @param grantee The principal to grant permissions to.
    */
  public grantWrite(grantee: IGrantable): void {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        'S3Vectors:addVectors',
        'S3Vectors:deleteVectors',
      ],
      resources: [this.indexArn],
    }));
  }
}

export { Bucket };
