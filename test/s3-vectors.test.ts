import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal, IGrantable } from 'aws-cdk-lib/aws-iam';
import { Bucket, Index, S3VectorKnowledgeBase } from '../src';

// A helper construct to test the grantWrite method
class TestGrantee extends Stack implements IGrantable {
  public readonly grantPrincipal: Role;
  constructor(scope: App, id: string) {
    super(scope, id);
    this.grantPrincipal = new Role(this, 'TestRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
  }
}

// ---- Bucket Construct Tests ----
describe('Bucket Construct', () => {
  let app: App;
  let stack: Stack;
  let template: Template;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
    new Bucket(stack, 'MyVectorBucket', {
      bucketName: 'my-test-bucket',
      region: 'us-east-1',
    });
    template = Template.fromStack(stack);
  });

  test('Creates a Custom Resource for the Bucket', () => {
    template.hasResourceProperties('Custom::AWS', {
      ServiceToken: Match.anyValue(),
      Create: Match.serializedJson({
        service: 'S3Vectors',
        action: 'createVectorBucket',
        parameters: Match.objectLike({
          vectorBucketName: 'my-test-bucket',
        }),
        physicalResourceId: Match.anyValue(),
        region: Match.anyValue(),
      }),
      Delete: Match.serializedJson({
        service: 'S3Vectors',
        action: 'deleteVectorBucket',
        parameters: Match.objectLike({
          vectorBucketName: 'my-test-bucket',
        }),
        region: Match.anyValue(),
      }),
    });
  });

  test('Bucket Snapshot Test', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});

// ---- Index Construct Tests ----
describe('Index Construct', () => {
  let app: App;
  let stack: Stack;
  let granteeStack: TestGrantee;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
    granteeStack = new TestGrantee(app, 'TestGranteeStack');
  });

  test('Index Creates a Custom Resource with correct props', () => {
    new Index(stack, 'MyVectorIndex', {
      bucketName: 'my-test-bucket',
      region: 'us-east-1',
      indexName: 'my-test-index',
      dataType: 'float32',
      dimension: 1536,
      distanceMetric: 'cosine',
    });
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::AWS', {
      ServiceToken: Match.anyValue(),
      Create: Match.serializedJson({
        service: 'S3Vectors',
        action: 'createIndex',
        parameters: Match.objectLike({
          vectorBucketName: 'my-test-bucket',
          indexName: 'my-test-index',
          dataType: 'float32',
          dimension: 1536,
          distanceMetric: 'cosine',
        }),
        physicalResourceId: Match.anyValue(),
        region: Match.anyValue(),
      }),
      Delete: Match.serializedJson({
        service: 'S3Vectors',
        action: 'deleteIndex',
        parameters: Match.objectLike({
          vectorBucketName: 'my-test-bucket',
          indexName: 'my-test-index',
        }),
        region: Match.anyValue(),
      }),
    });
  });

  test('Index creates without bucket dependency', () => {
    new Index(stack, 'MyVectorIndex', {
      bucketName: 'my-test-bucket',
      region: 'us-east-1',
      indexName: 'my-test-index',
      dataType: 'float32',
      dimension: 1536,
      distanceMetric: 'cosine',
    });
    const template = Template.fromStack(stack);

    template.hasResource('Custom::AWS', {
      Properties: Match.objectLike({
        Create: Match.serializedJson({
          service: 'S3Vectors',
          action: 'createIndex',
          parameters: Match.objectLike({
            vectorBucketName: 'my-test-bucket',
            indexName: 'my-test-index',
          }),
          physicalResourceId: Match.anyValue(),
          region: Match.anyValue(),
        }),
      }),
    });
  });

  test('grantWrite adds correct policy to grantee', () => {
    const index = new Index(stack, 'MyVectorIndex', {
      bucketName: 'my-test-bucket',
      region: 'us-east-1',
      indexName: 'my-test-index',
      dataType: 'float32',
      dimension: 1536,
      distanceMetric: 'cosine',
    });

    index.grantWrite(granteeStack);

    const granteeTemplate = Template.fromStack(granteeStack);

    granteeTemplate.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['S3Vectors:addVectors', 'S3Vectors:deleteVectors'],
            Resource: Match.objectLike({
              'Fn::ImportValue': Match.anyValue(),
            }),
          }),
        ]),
      }),
    });
  });

  test('Index validation throws for invalid dimension', () => {
    expect(() => {
      new Index(stack, 'InvalidIndex', {
        bucketName: 'my-test-bucket',
        region: 'us-east-1',
        indexName: 'invalid-index',
        dataType: 'float32',
        dimension: 0,
        distanceMetric: 'cosine',
      });
    }).toThrow('Dimension must be between 1 and 4096.');
  });
});

// ---- S3VectorKnowledgeBase Construct Tests ----
describe('S3VectorKnowledgeBase Construct', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  test('Creates knowledge base with all required resources', () => {
    new S3VectorKnowledgeBase(stack, 'MyKnowledgeBase', {
      knowledgeBaseName: 'test-kb',
      description: 'Test knowledge base',
      embeddingModelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1',
      bucketProps: {
        bucketName: 'test-vector-bucket',
        region: 'us-east-1',
      },
      indexProps: {
        bucketName: 'test-vector-bucket',
        region: 'us-east-1',
        indexName: 'test-index',
        dataType: 'float32',
        dimension: 1536,
        distanceMetric: 'cosine',
      },
    });

    const template = Template.fromStack(stack);

    // Check that we have 3 custom resources (bucket, index, knowledge base)
    template.resourceCountIs('Custom::AWS', 3);
  });

  test('Creates IAM role with correct permissions', () => {
    new S3VectorKnowledgeBase(stack, 'MyKnowledgeBase', {
      knowledgeBaseName: 'test-kb',
      embeddingModelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1',
      bucketProps: {
        bucketName: 'test-vector-bucket',
        region: 'us-east-1',
      },
      indexProps: {
        bucketName: 'test-vector-bucket',
        region: 'us-east-1',
        indexName: 'test-index',
        dataType: 'float32',
        dimension: 1536,
        distanceMetric: 'cosine',
      },
    });

    const template = Template.fromStack(stack);

    // Check IAM role
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Principal: { Service: 'bedrock.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
        }],
      },
    });

    // Check IAM role exists
    template.hasResource('AWS::IAM::Role', {});
  });

  test('Creates bucket and index resources', () => {
    new S3VectorKnowledgeBase(stack, 'MyKnowledgeBase', {
      knowledgeBaseName: 'test-kb',
      embeddingModelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1',
      bucketProps: {
        bucketName: 'test-vector-bucket',
        region: 'us-east-1',
      },
      indexProps: {
        bucketName: 'test-vector-bucket',
        region: 'us-east-1',
        indexName: 'test-index',
        dataType: 'float32',
        dimension: 1536,
        distanceMetric: 'cosine',
      },
    });

    const template = Template.fromStack(stack);

    // Check that we have 3 custom resources (bucket, index, knowledge base)
    template.resourceCountIs('Custom::AWS', 3);

    // Verify all resources are created
    template.hasResource('AWS::IAM::Role', {});
    template.hasResource('AWS::IAM::Policy', {});
  });
});