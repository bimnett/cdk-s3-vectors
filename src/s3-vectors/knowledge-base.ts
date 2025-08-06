import * as iam from 'aws-cdk-lib/aws-iam';
import * as custom_resources from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { Bucket, BucketProps } from './bucket';
import { Index, IndexProps } from './index';

export interface S3VectorKnowledgeBaseProps {
  /**
    * The name of the knowledge base.
    */
  readonly knowledgeBaseName: string;

  /**
    * A description of the knowledge base.
    */
  readonly description?: string;

  /**
    * The Amazon Resource Name (ARN) of the model used to create vector embeddings for the knowledge base.
    */
  readonly embeddingModelArn: string;

  /**
    * User provided props for the S3 vectors bucket construct.
    */
  readonly bucketProps: BucketProps;

  /**
    * User provided props for the S3 vectors index construct.
    */
  readonly indexProps: IndexProps;
}

export class S3VectorKnowledgeBase extends Construct {
  /**
    * The ID of the knowledge base.
    */
  public readonly knowledgeBaseId: string;

  /**
    * The Amazon Resource Name (ARN) of the knowledge base.
    */
  public readonly knowledgeBaseArn: string;


  /**
    * @summary Creates a new Bedrock knowledge base construct with S3 Vectors as the vector store.
    * @param {cdk.App} scope - Represents the scope for all resources.
    * @param {string} id - Scope-unique id.
    * @param {IndexProps} props - User provided props for the construct.
    * @access public
    */


  constructor(scope: Construct, id: string, props: S3VectorKnowledgeBaseProps) {
    super(scope, id);

    const vectorBucket = new Bucket(this, 'S3VectorBucket', props.bucketProps);

    const vectorIndex = new Index(this, 'S3VectorIndex', {
      ...props.indexProps,
      bucket: vectorBucket,
    });

    const knowledgeBaseRole = new iam.Role(this, 'KnowledgeBaseRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
    });

    knowledgeBaseRole.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject', 's3:ListBucket'],
      resources: [vectorBucket.bucketArn, `${vectorBucket.bucketArn}/*`],
    }));
    knowledgeBaseRole.addToPolicy(new iam.PolicyStatement({
      actions: ['s3vectors:addVectors', 's3vectors:deleteVectors'],
      resources: [vectorIndex.indexArn],
    }));
    knowledgeBaseRole.addToPolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: [props.embeddingModelArn],
    }));

    const onCreate: custom_resources.AwsSdkCall = {
      service: 'BedrockAgent',
      action: 'createKnowledgeBase',
      parameters: {
        name: props.knowledgeBaseName,
        description: props.description,
        roleArn: knowledgeBaseRole.roleArn,
        knowledgeBaseConfiguration: {
          type: 'VECTOR',
          vectorKnowledgeBaseConfiguration: {
            embeddingModelArn: props.embeddingModelArn,
          },
        },
        storageConfiguration: {
          type: 'S3_VECTORS',
          s3VectorsConfiguration: {
            vectorBucketArn: vectorBucket.bucketArn,
            indexArn: vectorIndex.indexArn,
            indexName: vectorIndex.indexName,
          },
        },
      },
      physicalResourceId: custom_resources.PhysicalResourceId.of(props.knowledgeBaseName),
      outputPaths: [
        'knowledgeBase.knowledgeBaseId',
        'knowledgeBase.knowledgeBaseArn',
      ],
    };

    const onDelete: custom_resources.AwsSdkCall = {
      service: 'BedrockAgent',
      action: 'deleteKnowledgeBase',
      parameters: { knowledgeBaseId: '{{knowledgeBase.knowledgeBaseId}}' },
    };

    const knowledgeBaseResource = new custom_resources.AwsCustomResource(this, 'KnowledgeBaseCustomResource', {
      onCreate: onCreate,
      onDelete: onDelete,
      policy: custom_resources.AwsCustomResourcePolicy.fromSdkCalls({ resources: custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

    this.knowledgeBaseId = knowledgeBaseResource.getResponseField('knowledgeBase.knowledgeBaseId').toString();
    this.knowledgeBaseArn = knowledgeBaseResource.getResponseField('knowledgeBase.knowledgeBaseArn').toString();

    // Ensure the knowledge base is created after the role, bucket, and index
    knowledgeBaseResource.node.addDependency(knowledgeBaseRole);
    knowledgeBaseResource.node.addDependency(vectorBucket);
    knowledgeBaseResource.node.addDependency(vectorIndex);
  }
}