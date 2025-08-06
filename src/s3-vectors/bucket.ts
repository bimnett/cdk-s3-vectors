import * as custom_resources from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

export interface BucketProps {
  /**
    * The bucket where the vector data will be stored.
    */
  readonly bucketName: string;

  /**
    * The encryption configuration for the S3 Vector bucket.
    */
  readonly encryptionConfiguration?: EncryptionConfiguration;

  /**
    * The AWS region where the resource will be created.
    */
  readonly region: string;
}

export interface EncryptionConfiguration {
  /**
    * The server-side encryption type. Must be 'aws:kms'.
    */
  readonly sseType: 'aws:kms';

  /**
    * The KMS key ARN to use for encryption.
    */
  readonly kmsKeyArn: string;
}


export class Bucket extends Construct {
  /**
    * The bucket where the vector data will be stored.
    */
  public readonly bucketName: string;

  /**
    * The AWS region where the resource will be created.
    */
  public readonly region: string;

  /**
    * @summary Creates a new Bucket construct for S3 Vectors.
    * @param {cdk.App} scope - Represents the scope for all resources.
    * @param {string} id - Scope-unique id.
    * @param {IndexProps} props - User provided props for the construct.
    * @access public
    */

  constructor(scope: Construct, id: string, props: BucketProps) {
    super(scope, id);
    this.bucketName = props.bucketName;
    this.region = props.region;

    const createParams: { [key: string]: any } = {
      vectorBucketName: props.bucketName,
    };

    if (props.encryptionConfiguration) {
      createParams.encryptionConfiguration = props.encryptionConfiguration;
    }

    const physicalResourceId = custom_resources.PhysicalResourceId.of(
      [
        props.bucketName,
        props.region,
        JSON.stringify(props.encryptionConfiguration || {}),
      ].join('-'),
    );

    const onCreate: custom_resources.AwsSdkCall = {
      service: 'S3Vectors',
      action: 'createVectorBucket',
      parameters: createParams,
      physicalResourceId: physicalResourceId,
      region: props.region,
    };

    const onDelete: custom_resources.AwsSdkCall = {
      service: 'S3Vectors',
      action: 'deleteVectorBucket',
      parameters: { vectorBucketName: props.bucketName },
      region: props.region,
    };

    new custom_resources.AwsCustomResource(this, 'S3VectorStoreCustomResource', {
      onCreate: onCreate,
      onDelete: onDelete,
      policy: custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
        resources: custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
  }
}