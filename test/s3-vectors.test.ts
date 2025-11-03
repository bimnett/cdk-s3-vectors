import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Bucket, Index, KnowledgeBase } from '../src';

describe('S3 Vectors Constructs', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
  });

  describe('Bucket', () => {
    test('creates bucket with minimal props', () => {
      new Bucket(stack, 'TestBucket', {
        vectorBucketName: 'test-bucket',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::Function', {
        Handler: 's3-vectors-create-bucket.handler',
        Runtime: 'nodejs22.x',
      });
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        vectorBucketName: 'test-bucket',
      });
    });

    test('creates bucket with AES256 encryption', () => {
      new Bucket(stack, 'TestBucket', {
        vectorBucketName: 'test-bucket',
        encryptionConfiguration: {
          sseType: 'AES256',
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        encryptionConfiguration: {
          sseType: 'AES256',
        },
      });
    });

    test('creates bucket with KMS encryption', () => {
      const key = new kms.Key(stack, 'TestKey');
      new Bucket(stack, 'TestBucket', {
        vectorBucketName: 'test-bucket',
        encryptionConfiguration: {
          sseType: 'aws:kms',
          kmsKey: key,
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::KMS::Key', {});
    });

    test('throws error when KMS encryption specified without key', () => {
      expect(() => {
        new Bucket(stack, 'TestBucket', {
          vectorBucketName: 'test-bucket',
          encryptionConfiguration: {
            sseType: 'aws:kms',
          },
        });
      }).toThrow('A kmsKey object must be provided when sseType is set to aws:kms');
    });

    test('grants list indexes permission', () => {
      const bucket = new Bucket(stack, 'TestBucket', {
        vectorBucketName: 'test-bucket',
      });
      const role = new cdk.aws_iam.Role(stack, 'TestRole', {
        assumedBy: new cdk.aws_iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      bucket.grantListIndexes(role);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [{
            Action: 's3vectors:ListIndexes',
            Effect: 'Allow',
          }],
        },
      });
    });
  });

  describe('Index', () => {
    test('creates index with minimal props', () => {
      new Index(stack, 'TestIndex', {
        vectorBucketName: 'test-bucket',
        indexName: 'test-index',
        dataType: 'float32',
        dimension: 1536,
        distanceMetric: 'cosine',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::Function', {
        Handler: 's3-vectors-create-index.handler',
        Runtime: 'nodejs22.x',
      });
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        vectorBucketName: 'test-bucket',
        indexName: 'test-index',
        dataType: 'float32',
        dimension: 1536,
        distanceMetric: 'cosine',
      });
    });

    test('creates index with metadata configuration', () => {
      new Index(stack, 'TestIndex', {
        vectorBucketName: 'test-bucket',
        indexName: 'test-index',
        dataType: 'float32',
        dimension: 1536,
        distanceMetric: 'euclidean',
        metadataConfiguration: {
          nonFilterableMetadataKeys: ['key1', 'key2'],
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        metadataConfiguration: {
          nonFilterableMetadataKeys: ['key1', 'key2'],
        },
      });
    });

    test('throws error for invalid dimension', () => {
      expect(() => {
        new Index(stack, 'TestIndex', {
          vectorBucketName: 'test-bucket',
          indexName: 'test-index',
          dataType: 'float32',
          dimension: 0,
          distanceMetric: 'cosine',
        });
      }).toThrow('Dimension must be between 1 and 4096.');

      expect(() => {
        new Index(stack, 'TestIndex2', {
          vectorBucketName: 'test-bucket',
          indexName: 'test-index',
          dataType: 'float32',
          dimension: 5000,
          distanceMetric: 'cosine',
        });
      }).toThrow('Dimension must be between 1 and 4096.');
    });

    test('grants write permission', () => {
      const index = new Index(stack, 'TestIndex', {
        vectorBucketName: 'test-bucket',
        indexName: 'test-index',
        dataType: 'float32',
        dimension: 1536,
        distanceMetric: 'cosine',
      });
      const role = new cdk.aws_iam.Role(stack, 'TestRole', {
        assumedBy: new cdk.aws_iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      index.grantWrite(role);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [{
            Action: ['s3vectors:PutVectors', 's3vectors:DeleteVectors'],
            Effect: 'Allow',
          }],
        },
      });
    });
  });

  describe('KnowledgeBase', () => {
    test('creates knowledge base with minimal props', () => {
      new KnowledgeBase(stack, 'TestKB', {
        knowledgeBaseName: 'test-kb',
        knowledgeBaseConfiguration: {
          embeddingModelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1',
        },
        vectorBucketArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket',
        indexArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket/index/test-index',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Principal: { Service: 'bedrock.amazonaws.com' },
            Action: 'sts:AssumeRole',
          }],
        },
      });
      template.hasResourceProperties('AWS::Lambda::Function', {
        Handler: 's3-vectors-create-kb.handler',
        Runtime: 'nodejs22.x',
      });
    });

    test('creates knowledge base with all props', () => {
      new KnowledgeBase(stack, 'TestKB', {
        knowledgeBaseName: 'test-kb',
        description: 'Test knowledge base',
        clientToken: 'a'.repeat(33),
        knowledgeBaseConfiguration: {
          embeddingModelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1',
          embeddingDataType: 'FLOAT32',
          dimensions: '1536',
        },
        vectorBucketArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket',
        indexArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket/index/test-index',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        knowledgeBaseName: 'test-kb',
        description: 'Test knowledge base',
        clientToken: 'a'.repeat(33),
        knowledgeBaseConfiguration: {
          embeddingDataType: 'FLOAT32',
          dimensions: '1536',
        },
      });
    });

    test('throws error for short client token', () => {
      expect(() => {
        new KnowledgeBase(stack, 'TestKB', {
          knowledgeBaseName: 'test-kb',
          clientToken: 'short',
          knowledgeBaseConfiguration: {
            embeddingModelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1',
          },
          vectorBucketArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket',
          indexArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket/index/test-index',
        });
      }).toThrow('The client token must have a length greater than or equal to 33.');
    });

    test('grants ingestion permission', () => {
      const kb = new KnowledgeBase(stack, 'TestKB', {
        knowledgeBaseName: 'test-kb',
        knowledgeBaseConfiguration: {
          embeddingModelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1',
        },
        vectorBucketArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket',
        indexArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket/index/test-index',
      });
      const role = new cdk.aws_iam.Role(stack, 'TestRole', {
        assumedBy: new cdk.aws_iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      kb.grantIngestion(role);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [{
            Action: 'bedrock:StartIngestionJob',
            Effect: 'Allow',
          }],
        },
      });
    });

    test('exposes the knowledge base IAM role', () => {
      const kb = new KnowledgeBase(stack, 'TestKB', {
        knowledgeBaseName: 'test-kb',
        knowledgeBaseConfiguration: {
          embeddingModelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1',
        },
        vectorBucketArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket',
        indexArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket/index/test-index',
      });

      expect(kb.role).toBeInstanceOf(cdk.aws_iam.Role);
    });

    test('role has correct S3 and KMS permissions', () => {
      new KnowledgeBase(stack, 'TestKB', {
        knowledgeBaseName: 'test-kb',
        knowledgeBaseConfiguration: {
          embeddingModelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1',
        },
        vectorBucketArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket',
        indexArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket/index/test-index',
      });

      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 's3vectors:*',
              Effect: 'Allow',
              Resource: Match.arrayWith([
                'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket/index/test-index',
                'arn:aws:s3vectors:us-east-1:123456789012:bucket/test-bucket',
              ]),
            }),
            Match.objectLike({
              Action: Match.arrayWith([
                'kms:Decrypt',
                'kms:GenerateDataKey',
                'kms:DescribeKey',
              ]),
              Effect: 'Allow',
              Resource: '*',
            }),
          ]),
        },
      });
    });
  });
});