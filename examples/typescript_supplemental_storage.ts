// Example using supplementalDataStorageConfiguration
import { Construct } from 'constructs';
import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3Vectors from 'cdk-s3-vectors';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { aws_iam as iam } from "aws-cdk-lib";

export class S3VectorsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const embeddingModel = bedrock.FoundationModel.fromFoundationModelId(
      this,
      "EmbeddingModel",
      bedrock.FoundationModelIdentifier.AMAZON_TITAN_EMBED_TEXT_V2_0,
    );

    const parsingModel = bedrock.FoundationModel.fromFoundationModelId(
      this,
      "ParsingModel",
      bedrock.FoundationModelIdentifier
        .ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0,
    );


    // Create S3 bucket for storing documents
    const documentBucket = new s3.Bucket(this, 'document-bucket', {
      enforceSSL: true,
      versioned: false
    });

    const supplementalBucket = new s3.Bucket(this, "SupplementalBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      enforceSSL: true,
    });


    // Create KMS key for encryption (optional)
    const encryptionKey = new kms.Key(this, 'VectorBucketKey', {
      description: 'KMS key for S3 vector bucket encryption',
      enableKeyRotation: true,
    });

    // Create a vector bucket with all options
    const vectorBucket = new s3Vectors.Bucket(this, 'VectorBucket', {
      vectorBucketName: 'my-vector-bucket', // REQUIRED
      // Optional encryption configuration
      encryptionConfiguration: {
        sseType: 'aws:kms', // 'AES256' | 'aws:kms'
        kmsKey: encryptionKey, // Required when sseType is 'aws:kms'
      },
    });

    // Create a vector index with all options
    const vectorIndex = new s3Vectors.Index(this, 'VectorIndex', {
      vectorBucketName: vectorBucket.vectorBucketName, // REQUIRED
      indexName: 'my-index', // REQUIRED
      dataType: 'float32', // REQUIRED (only 'float32' supported)
      dimension: 1024, // REQUIRED (1-4096)
      distanceMetric: 'euclidean', // REQUIRED ('euclidean' | 'cosine')
      // Optional metadata configuration
      metadataConfiguration: {
        nonFilterableMetadataKeys: [
          "source_url",
          "source_collection",
          "AMAZON_BEDROCK_TEXT",
          "AMAZON_BEDROCK_METADATA",
          "x-amz-bedrock-kb-source-uri",
          "x-amz-bedrock-kb-document-page-number",
          "x-amz-bedrock-kb-chunk-id",
          "x-amz-bedrock-kb-data-source-id",
        ],
      },
    });
    // REQUIRED - add dependency for vector index
    vectorIndex.node.addDependency(vectorBucket);

    // Create a knowledge base with all options
    const knowledgeBase = new s3Vectors.KnowledgeBase(this, 'KnowledgeBase', {
      knowledgeBaseName: 'my-knowledge-base', // REQUIRED
      vectorBucketArn: vectorBucket.vectorBucketArn, // REQUIRED
      indexArn: vectorIndex.indexArn, // REQUIRED
      // REQUIRED knowledge base configuration
      knowledgeBaseConfiguration: {
        embeddingModelArn:  embeddingModel.modelArn,
        embeddingDataType: 'FLOAT32', // Optional: 'BINARY' | 'FLOAT32'
        dimensions: '1024', // Optional: dimensions as string
        supplementalDataStorageConfiguration: {
          s3Location: supplementalBucket.s3Location
        }
      },
      // Optional fields
      description: 'Knowledge base for vector similarity search using S3 Vectors',
    });
    // REQUIRED - add dependencies for knowledge base
    knowledgeBase.node.addDependency(vectorIndex);
    knowledgeBase.node.addDependency(vectorBucket);

    knowledgeBase.role?.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: [parsingModel.modelArn, embeddingModel.modelArn],
        effect: iam.Effect.ALLOW,
      }),
    );
    supplementalBucket.grantReadWrite(knowledgeBase.role!);

    // Create data source for knowledge base
    const dataSource = new bedrock.CfnDataSource(this, "KnowledgeBaseDataSource", {
      name: 'my-data-source',
      knowledgeBaseId: knowledgeBase.knowledgeBaseId,
      dataSourceConfiguration: {
        type: "S3",
        s3Configuration: {
          bucketArn: documentBucket.bucketArn,
        },
      },
      vectorIngestionConfiguration: {
        parsingConfiguration: {
          parsingStrategy: "BEDROCK_FOUNDATION_MODEL",
          bedrockFoundationModelConfiguration: {
            modelArn: parsingModel.modelArn,
          },
        },
      },
    });
    // Allow knowledge base to read from document bucket
    documentBucket.grantRead(knowledgeBase.role);
  }
}