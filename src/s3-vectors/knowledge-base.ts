import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IGrantable } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as custom_resources from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';


export interface KnowledgeBaseProps {
  /**
    * The name of the knowledge base to create.
    */
  readonly knowledgeBaseName: string;

  /**
    * Contains details about the vector embeddings configuration of the knowledge base.
    */
  readonly knowledgeBaseConfiguration: KnowledgeBaseConfiguration;

  /**
    * The ARN (Amazon Resource Name) of the S3 bucket where vector embeddings are stored.
    * This bucket contains the vector data used by the knowledge base.
    */
  readonly vectorBucketArn: string;

  /**
    * The ARN (Amazon Resource Name) of the vector index used for the knowledge base.
    * This ARN identifies the specific vector index resource within Amazon Bedrock.
    */
  readonly indexArn: string;

  /**
    * A description of the knowledge base.
    */
  readonly description?: string;

  /**
    * A unique, case-sensitive identifier to ensure that the API request completes no more than one time.
    * Must have length greater than or equal to 33.
    *
    * If this token matches a previous request, Amazon Bedrock ignores the request, but does not return an error.
    * For more information, see [Ensuring Idempotency](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/Run_Instance_Idempotency.html).
    */
  readonly clientToken?: string;
}

export interface KnowledgeBaseConfiguration {
  /**
    * The ARN (Amazon Resource Name) of the model used to create vector embeddings for the knowledge base.
    */
  readonly embeddingModelArn: string;

  /**
    * The data type for the vectors when using a model to convert text into vector embeddings.
    * The model must support the specified data type for vector embeddings.
    *
    * Floating-point (float32) is the default data type, and is supported by most models for vector embeddings.
    * See [Supported embeddings models](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-supported.html)
    * for information on the available models and their vector data types.
    */
  readonly embeddingDataType?: 'BINARY' | 'FLOAT32';

  /**
    * The dimensions details for the vector configuration used on the Bedrock embeddings model.
    *
    * Must be supported by the chosen embedding model.
    */
  readonly dimensions?: string;

  /**
    * Multi model supplemental data storage configuration
    *
    * See https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent_SupplementalDataStorageConfiguration.html.
    */
  readonly supplementalDataStorageConfiguration?: SupplementalDataStorageConfiguration;
}


export interface SupplementalDataStorageConfiguration {
  /**
    * The S3 URI for the supplemental data storage.
    */
  readonly s3Location: string;
}


/**
 * Creates a Amazon Bedrock knowledge base with S3 Vectors as the underlying vector store.
 *
 * To create a knowledge base, you must first set up and configure a S3 Vectors bucket and index.
 * For more information, see [Set up a knowledge base](https://docs.aws.amazon.com/bedrock/latest/userguide/knowlege-base-prereq.html).
 */
export class KnowledgeBase extends Construct {
  /**
    * The ID of the knowledge base.
    */
  public readonly knowledgeBaseId: string;

  /**
    * The Amazon Resource Name (ARN) of the knowledge base.
    */
  public readonly knowledgeBaseArn: string;

  /**
   * The IAM role for the knowledge base.
   */
  public readonly role: iam.Role;

  /**
    * @summary Creates a new Bedrock knowledge base construct with S3 Vectors as the vector store.
    * @param {cdk.App} scope - Represents the scope for all resources.
    * @param {string} id - Scope-unique id.
    * @param {KnowledgeBaseProps} props - User provided props for the construct.
    * @access public
    */


  constructor(scope: Construct, id: string, props: KnowledgeBaseProps) {
    super(scope, id);
    if (props.clientToken && props.clientToken.length < 33) {
      throw new Error('The client token must have a length greater than or equal to 33.');
    }

    const region = cdk.Stack.of(this).region;
    const accountId = cdk.Stack.of(this).account;
    const constructedKnowledgeBaseArn = `arn:aws:bedrock:${region}:${accountId}:knowledge-base/*`;

    this.role = new iam.Role(this, 'BedrockKnowledgeBaseRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      description: `IAM role for Bedrock Knowledge Base ${props.knowledgeBaseName}`,
    });

    this.role.addToPolicy(new iam.PolicyStatement({
      actions: ['s3vectors:*'],
      resources: [props.indexArn, props.vectorBucketArn],
    }));

    this.role.addToPolicy(new iam.PolicyStatement({
      actions: [
        'kms:Decrypt',
        'kms:GenerateDataKey',
        'kms:DescribeKey',
      ],
      resources: ['*'],
    }));

    this.role.addToPolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: [props.knowledgeBaseConfiguration.embeddingModelArn],
    }));

    const bedrockKnowledgeBaseHandler = new lambda.Function(this, 'BedrockKBHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 's3-vectors-create-kb.handler',
      code: lambda.Code.fromAsset(__dirname + '/../lambda'),
      timeout: cdk.Duration.minutes(5),
    });

    // Add all permissions upfront to avoid circular dependency
    bedrockKnowledgeBaseHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'bedrock:CreateKnowledgeBase',
        'iam:PassRole',
      ],
      resources: ['*'],
    }));

    bedrockKnowledgeBaseHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'bedrock:GetKnowledgeBase',
        'bedrock:UpdateKnowledgeBase',
        'bedrock:DeleteKnowledgeBase',
      ],
      resources: [constructedKnowledgeBaseArn],
    }));

    this.role.grantAssumeRole(bedrockKnowledgeBaseHandler.grantPrincipal);

    const bedrockKnowledgeBaseProvider = new custom_resources.Provider(this, 'BedrockKBProvider', {
      onEventHandler: bedrockKnowledgeBaseHandler,
    });

    const customResource = new cdk.CustomResource(this, 'BedrockKnowledgeBaseCustomResource', {
      serviceToken: bedrockKnowledgeBaseProvider.serviceToken,
      properties: {
        knowledgeBaseName: props.knowledgeBaseName,
        description: props.description,
        clientToken: props.clientToken,
        roleArn: this.role.roleArn,
        indexArn: props.indexArn,
        vectorBucketArn: props.vectorBucketArn,
        knowledgeBaseConfiguration: {
          embeddingDataType: props.knowledgeBaseConfiguration.embeddingDataType,
          dimensions: props.knowledgeBaseConfiguration.dimensions,
          embeddingModelArn: props.knowledgeBaseConfiguration.embeddingModelArn,
        },
      },
    });

    this.knowledgeBaseId = customResource.getAttString('KnowledgeBaseId');
    this.knowledgeBaseArn = customResource.getAttString('KnowledgeBaseArn');
  }

  /**
    * Grants permission to start an ingestion job for the knowledge base.
    * @param grantee The principal to grant permissions to.
    */
  public grantIngestion(grantee: IGrantable): void {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        'bedrock:StartIngestionJob',
      ],
      resources: [this.knowledgeBaseArn],
    }));
  }
}