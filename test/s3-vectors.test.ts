import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal, IGrantable } from 'aws-cdk-lib/aws-iam';
import { Bucket, Index } from '../src/s3-vectors';

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
  let bucket: Bucket;
  let granteeStack: TestGrantee;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
    bucket = new Bucket(stack, 'MyVectorBucket', {
      bucketName: 'my-test-bucket',
      region: 'us-east-1',
    });
    granteeStack = new TestGrantee(app, 'TestGranteeStack');
  });

  test('Index Creates a Custom Resource with correct props', () => {
    new Index(stack, 'MyVectorIndex', {
      bucket: bucket,
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

  test('Index has a dependency on the Bucket', () => {
    new Index(stack, 'MyVectorIndex', {
      bucket: bucket,
      indexName: 'my-test-index',
      dataType: 'float32',
      dimension: 1536,
      distanceMetric: 'cosine',
    });
    const template = Template.fromStack(stack);

    const bucketResource = template.findResources('Custom::AWS', {
      Properties: Match.objectLike({
        Create: Match.serializedJson({
          service: 'S3Vectors',
          action: 'createVectorBucket',
          parameters: { vectorBucketName: 'my-test-bucket' },
          physicalResourceId: Match.anyValue(),
          region: Match.anyValue(),
        }),
      }),
    });
    const bucketLogicalId = Object.keys(bucketResource)[0];

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
      DependsOn: Match.arrayWith([bucketLogicalId]),
    });
  });

  test('grantWrite adds correct policy to grantee', () => {
    const index = new Index(stack, 'MyVectorIndex', {
      bucket: bucket,
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
        bucket: bucket,
        indexName: 'invalid-index',
        dataType: 'float32',
        dimension: 0,
        distanceMetric: 'cosine',
      });
    }).toThrow('Dimension must be between 1 and 4096.');
  });
});