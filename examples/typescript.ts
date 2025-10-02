import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3Vectors from 'cdk-s3-vectors';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';

export class S3VectorsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create S3 bucket for storing documents
    const documentBucket = new s3.Bucket(this, 'document-bucket', {
      enforceSSL: true,
      versioned: false
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
      distanceMetric: 'cosine', // REQUIRED ('euclidean' | 'cosine')
      // Optional metadata configuration
      metadataConfiguration: {
        nonFilterableMetadataKeys: ['source', 'timestamp', 'category'],
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
        embeddingModelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0', // REQUIRED
        embeddingDataType: 'FLOAT32', // Optional: 'BINARY' | 'FLOAT32'
        dimensions: '1024', // Optional: dimensions as string
      },
      // Optional fields
      description: 'Knowledge base for vector similarity search using S3 Vectors',
      clientToken: 'unique-client-token-12345678901234567890123456789012345', // Must be >= 33 characters
    });
    // REQUIRED - add dependencies for knowledge base
    knowledgeBase.node.addDependency(vectorIndex);
    knowledgeBase.node.addDependency(vectorBucket);

    // Create data source for knowledge base
    const dataSource = new bedrock.CfnDataSource(this, "data-source", {
      name: 'my-data-source',
      knowledgeBaseId: knowledgeBase.knowledgeBaseId,
      dataSourceConfiguration: {
        type: 'S3',
        s3Configuration: {
          bucketArn: documentBucket.bucketArn,
        }
      }
    });

    // Allow knowledge base to read from document bucket
    documentBucket.grantRead(knowledgeBase.role);
  }
}