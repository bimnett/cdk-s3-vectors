# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Bucket <a name="Bucket" id="cdk-s3-vectors.Bucket"></a>

Amazon S3 Vectors is in preview release for Amazon S3 and is subject to change.

Creates a vector bucket in the specified AWS Region.

#### Initializers <a name="Initializers" id="cdk-s3-vectors.Bucket.Initializer"></a>

```typescript
import { Bucket } from 'cdk-s3-vectors'

new Bucket(scope: Construct, id: string, props: BucketProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.Bucket.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - Represents the scope for all resources. |
| <code><a href="#cdk-s3-vectors.Bucket.Initializer.parameter.id">id</a></code> | <code>string</code> | - Scope-unique id. |
| <code><a href="#cdk-s3-vectors.Bucket.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-s3-vectors.BucketProps">BucketProps</a></code> | - User provided props for the construct. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-s3-vectors.Bucket.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

Represents the scope for all resources.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-s3-vectors.Bucket.Initializer.parameter.id"></a>

- *Type:* string

Scope-unique id.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-s3-vectors.Bucket.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-s3-vectors.BucketProps">BucketProps</a>

User provided props for the construct.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-s3-vectors.Bucket.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-s3-vectors.Bucket.grantListIndexes">grantListIndexes</a></code> | Grants permissions to list indexes within this vector bucket. |

---

##### `toString` <a name="toString" id="cdk-s3-vectors.Bucket.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantListIndexes` <a name="grantListIndexes" id="cdk-s3-vectors.Bucket.grantListIndexes"></a>

```typescript
public grantListIndexes(grantee: IGrantable): void
```

Grants permissions to list indexes within this vector bucket.

###### `grantee`<sup>Required</sup> <a name="grantee" id="cdk-s3-vectors.Bucket.grantListIndexes.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

The principal to grant permissions to.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-s3-vectors.Bucket.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-s3-vectors.Bucket.isConstruct"></a>

```typescript
import { Bucket } from 'cdk-s3-vectors'

Bucket.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-s3-vectors.Bucket.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.Bucket.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-s3-vectors.Bucket.property.vectorBucketArn">vectorBucketArn</a></code> | <code>string</code> | The ARN (Amazon Resource Name) of the created S3 vector bucket. |
| <code><a href="#cdk-s3-vectors.Bucket.property.vectorBucketName">vectorBucketName</a></code> | <code>string</code> | The name of the vector bucket to create. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-s3-vectors.Bucket.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `vectorBucketArn`<sup>Required</sup> <a name="vectorBucketArn" id="cdk-s3-vectors.Bucket.property.vectorBucketArn"></a>

```typescript
public readonly vectorBucketArn: string;
```

- *Type:* string

The ARN (Amazon Resource Name) of the created S3 vector bucket.

---

##### `vectorBucketName`<sup>Required</sup> <a name="vectorBucketName" id="cdk-s3-vectors.Bucket.property.vectorBucketName"></a>

```typescript
public readonly vectorBucketName: string;
```

- *Type:* string

The name of the vector bucket to create.

---


### Index <a name="Index" id="cdk-s3-vectors.Index"></a>

Amazon S3 Vectors is in preview release for Amazon S3 and is subject to change.

Creates a vector index within a vector bucket.
To specify the vector bucket, you must use either the vector bucket name or the vector bucket ARN (Amazon Resource Name).

#### Initializers <a name="Initializers" id="cdk-s3-vectors.Index.Initializer"></a>

```typescript
import { Index } from 'cdk-s3-vectors'

new Index(scope: Construct, id: string, props: IndexProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.Index.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - Represents the scope for all resources. |
| <code><a href="#cdk-s3-vectors.Index.Initializer.parameter.id">id</a></code> | <code>string</code> | - Scope-unique id. |
| <code><a href="#cdk-s3-vectors.Index.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-s3-vectors.IndexProps">IndexProps</a></code> | - User provided props for the construct. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-s3-vectors.Index.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

Represents the scope for all resources.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-s3-vectors.Index.Initializer.parameter.id"></a>

- *Type:* string

Scope-unique id.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-s3-vectors.Index.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-s3-vectors.IndexProps">IndexProps</a>

User provided props for the construct.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-s3-vectors.Index.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-s3-vectors.Index.grantWrite">grantWrite</a></code> | Grants write permissions (add/delete vectors) to the index. |

---

##### `toString` <a name="toString" id="cdk-s3-vectors.Index.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantWrite` <a name="grantWrite" id="cdk-s3-vectors.Index.grantWrite"></a>

```typescript
public grantWrite(grantee: IGrantable): void
```

Grants write permissions (add/delete vectors) to the index.

###### `grantee`<sup>Required</sup> <a name="grantee" id="cdk-s3-vectors.Index.grantWrite.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

The principal to grant permissions to.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-s3-vectors.Index.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-s3-vectors.Index.isConstruct"></a>

```typescript
import { Index } from 'cdk-s3-vectors'

Index.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-s3-vectors.Index.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.Index.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-s3-vectors.Index.property.indexArn">indexArn</a></code> | <code>string</code> | The ARN (Amazon Resource Name) of the S3 Vector index. |
| <code><a href="#cdk-s3-vectors.Index.property.indexName">indexName</a></code> | <code>string</code> | The name of the index. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-s3-vectors.Index.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `indexArn`<sup>Required</sup> <a name="indexArn" id="cdk-s3-vectors.Index.property.indexArn"></a>

```typescript
public readonly indexArn: string;
```

- *Type:* string

The ARN (Amazon Resource Name) of the S3 Vector index.

---

##### `indexName`<sup>Required</sup> <a name="indexName" id="cdk-s3-vectors.Index.property.indexName"></a>

```typescript
public readonly indexName: string;
```

- *Type:* string

The name of the index.

---


### KnowledgeBase <a name="KnowledgeBase" id="cdk-s3-vectors.KnowledgeBase"></a>

Creates a Amazon Bedrock knowledge base with S3 Vectors as the underlying vector store.

To create a knowledge base, you must first set up and configure a S3 Vectors bucket and index.
For more information, see [Set up a knowledge base](https://docs.aws.amazon.com/bedrock/latest/userguide/knowlege-base-prereq.html).

#### Initializers <a name="Initializers" id="cdk-s3-vectors.KnowledgeBase.Initializer"></a>

```typescript
import { KnowledgeBase } from 'cdk-s3-vectors'

new KnowledgeBase(scope: Construct, id: string, props: KnowledgeBaseProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.KnowledgeBase.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - Represents the scope for all resources. |
| <code><a href="#cdk-s3-vectors.KnowledgeBase.Initializer.parameter.id">id</a></code> | <code>string</code> | - Scope-unique id. |
| <code><a href="#cdk-s3-vectors.KnowledgeBase.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-s3-vectors.KnowledgeBaseProps">KnowledgeBaseProps</a></code> | - User provided props for the construct. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-s3-vectors.KnowledgeBase.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

Represents the scope for all resources.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-s3-vectors.KnowledgeBase.Initializer.parameter.id"></a>

- *Type:* string

Scope-unique id.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-s3-vectors.KnowledgeBase.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-s3-vectors.KnowledgeBaseProps">KnowledgeBaseProps</a>

User provided props for the construct.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-s3-vectors.KnowledgeBase.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-s3-vectors.KnowledgeBase.grantIngestion">grantIngestion</a></code> | Grants permission to start an ingestion job for the knowledge base. |

---

##### `toString` <a name="toString" id="cdk-s3-vectors.KnowledgeBase.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantIngestion` <a name="grantIngestion" id="cdk-s3-vectors.KnowledgeBase.grantIngestion"></a>

```typescript
public grantIngestion(grantee: IGrantable): void
```

Grants permission to start an ingestion job for the knowledge base.

###### `grantee`<sup>Required</sup> <a name="grantee" id="cdk-s3-vectors.KnowledgeBase.grantIngestion.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

The principal to grant permissions to.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-s3-vectors.KnowledgeBase.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-s3-vectors.KnowledgeBase.isConstruct"></a>

```typescript
import { KnowledgeBase } from 'cdk-s3-vectors'

KnowledgeBase.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-s3-vectors.KnowledgeBase.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.KnowledgeBase.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-s3-vectors.KnowledgeBase.property.knowledgeBaseArn">knowledgeBaseArn</a></code> | <code>string</code> | The Amazon Resource Name (ARN) of the knowledge base. |
| <code><a href="#cdk-s3-vectors.KnowledgeBase.property.knowledgeBaseId">knowledgeBaseId</a></code> | <code>string</code> | The ID of the knowledge base. |
| <code><a href="#cdk-s3-vectors.KnowledgeBase.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.Role</code> | The IAM role for the knowledge base. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-s3-vectors.KnowledgeBase.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `knowledgeBaseArn`<sup>Required</sup> <a name="knowledgeBaseArn" id="cdk-s3-vectors.KnowledgeBase.property.knowledgeBaseArn"></a>

```typescript
public readonly knowledgeBaseArn: string;
```

- *Type:* string

The Amazon Resource Name (ARN) of the knowledge base.

---

##### `knowledgeBaseId`<sup>Required</sup> <a name="knowledgeBaseId" id="cdk-s3-vectors.KnowledgeBase.property.knowledgeBaseId"></a>

```typescript
public readonly knowledgeBaseId: string;
```

- *Type:* string

The ID of the knowledge base.

---

##### `role`<sup>Required</sup> <a name="role" id="cdk-s3-vectors.KnowledgeBase.property.role"></a>

```typescript
public readonly role: Role;
```

- *Type:* aws-cdk-lib.aws_iam.Role

The IAM role for the knowledge base.

---


## Structs <a name="Structs" id="Structs"></a>

### BucketProps <a name="BucketProps" id="cdk-s3-vectors.BucketProps"></a>

#### Initializer <a name="Initializer" id="cdk-s3-vectors.BucketProps.Initializer"></a>

```typescript
import { BucketProps } from 'cdk-s3-vectors'

const bucketProps: BucketProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.BucketProps.property.vectorBucketName">vectorBucketName</a></code> | <code>string</code> | The name of the vector bucket to create. |
| <code><a href="#cdk-s3-vectors.BucketProps.property.encryptionConfiguration">encryptionConfiguration</a></code> | <code><a href="#cdk-s3-vectors.EncryptionConfiguration">EncryptionConfiguration</a></code> | The encryption configuration for the vector bucket. |

---

##### `vectorBucketName`<sup>Required</sup> <a name="vectorBucketName" id="cdk-s3-vectors.BucketProps.property.vectorBucketName"></a>

```typescript
public readonly vectorBucketName: string;
```

- *Type:* string

The name of the vector bucket to create.

---

##### `encryptionConfiguration`<sup>Optional</sup> <a name="encryptionConfiguration" id="cdk-s3-vectors.BucketProps.property.encryptionConfiguration"></a>

```typescript
public readonly encryptionConfiguration: EncryptionConfiguration;
```

- *Type:* <a href="#cdk-s3-vectors.EncryptionConfiguration">EncryptionConfiguration</a>

The encryption configuration for the vector bucket.

By default, if you don't specify, all new vectors in Amazon S3 vector buckets use
server-side encryption with Amazon S3 managed keys (SSE-S3), specifically `AES256`.

---

### EncryptionConfiguration <a name="EncryptionConfiguration" id="cdk-s3-vectors.EncryptionConfiguration"></a>

#### Initializer <a name="Initializer" id="cdk-s3-vectors.EncryptionConfiguration.Initializer"></a>

```typescript
import { EncryptionConfiguration } from 'cdk-s3-vectors'

const encryptionConfiguration: EncryptionConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.EncryptionConfiguration.property.sseType">sseType</a></code> | <code>string</code> | The server-side encryption type. Must be `AES256` or `aws:kms`. |
| <code><a href="#cdk-s3-vectors.EncryptionConfiguration.property.kmsKey">kmsKey</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | The AWS Key Management Service (KMS) customer managed key to use for server-side encryption. |

---

##### `sseType`<sup>Required</sup> <a name="sseType" id="cdk-s3-vectors.EncryptionConfiguration.property.sseType"></a>

```typescript
public readonly sseType: string;
```

- *Type:* string

The server-side encryption type. Must be `AES256` or `aws:kms`.

By default, if you don't specify, all new vectors in Amazon S3 vector buckets use
server-side encryption with Amazon S3 managed keys (SSE-S3), specifically `AES256`.

---

##### `kmsKey`<sup>Optional</sup> <a name="kmsKey" id="cdk-s3-vectors.EncryptionConfiguration.property.kmsKey"></a>

```typescript
public readonly kmsKey: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey

The AWS Key Management Service (KMS) customer managed key to use for server-side encryption.

This parameter is allowed if and **only** if `sseType` is set to `aws:kms`.

---

### IndexProps <a name="IndexProps" id="cdk-s3-vectors.IndexProps"></a>

#### Initializer <a name="Initializer" id="cdk-s3-vectors.IndexProps.Initializer"></a>

```typescript
import { IndexProps } from 'cdk-s3-vectors'

const indexProps: IndexProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.IndexProps.property.dataType">dataType</a></code> | <code>string</code> | The data type of the vectors in the index. |
| <code><a href="#cdk-s3-vectors.IndexProps.property.dimension">dimension</a></code> | <code>number</code> | The dimensions of the vectors to be inserted into the vector index. |
| <code><a href="#cdk-s3-vectors.IndexProps.property.distanceMetric">distanceMetric</a></code> | <code>string</code> | The distance metric to be used for similarity search. |
| <code><a href="#cdk-s3-vectors.IndexProps.property.indexName">indexName</a></code> | <code>string</code> | The name of the vector index to create. |
| <code><a href="#cdk-s3-vectors.IndexProps.property.vectorBucketName">vectorBucketName</a></code> | <code>string</code> | The name of the vector bucket to create the vector index in. |
| <code><a href="#cdk-s3-vectors.IndexProps.property.metadataConfiguration">metadataConfiguration</a></code> | <code><a href="#cdk-s3-vectors.MetadataConfiguration">MetadataConfiguration</a></code> | The metadata configuration for the vector index. |

---

##### `dataType`<sup>Required</sup> <a name="dataType" id="cdk-s3-vectors.IndexProps.property.dataType"></a>

```typescript
public readonly dataType: string;
```

- *Type:* string

The data type of the vectors in the index.

Must be 'float32'

---

##### `dimension`<sup>Required</sup> <a name="dimension" id="cdk-s3-vectors.IndexProps.property.dimension"></a>

```typescript
public readonly dimension: number;
```

- *Type:* number

The dimensions of the vectors to be inserted into the vector index.

---

##### `distanceMetric`<sup>Required</sup> <a name="distanceMetric" id="cdk-s3-vectors.IndexProps.property.distanceMetric"></a>

```typescript
public readonly distanceMetric: string;
```

- *Type:* string

The distance metric to be used for similarity search.

---

##### `indexName`<sup>Required</sup> <a name="indexName" id="cdk-s3-vectors.IndexProps.property.indexName"></a>

```typescript
public readonly indexName: string;
```

- *Type:* string

The name of the vector index to create.

---

##### `vectorBucketName`<sup>Required</sup> <a name="vectorBucketName" id="cdk-s3-vectors.IndexProps.property.vectorBucketName"></a>

```typescript
public readonly vectorBucketName: string;
```

- *Type:* string

The name of the vector bucket to create the vector index in.

---

##### `metadataConfiguration`<sup>Optional</sup> <a name="metadataConfiguration" id="cdk-s3-vectors.IndexProps.property.metadataConfiguration"></a>

```typescript
public readonly metadataConfiguration: MetadataConfiguration;
```

- *Type:* <a href="#cdk-s3-vectors.MetadataConfiguration">MetadataConfiguration</a>

The metadata configuration for the vector index.

---

### KnowledgeBaseConfiguration <a name="KnowledgeBaseConfiguration" id="cdk-s3-vectors.KnowledgeBaseConfiguration"></a>

#### Initializer <a name="Initializer" id="cdk-s3-vectors.KnowledgeBaseConfiguration.Initializer"></a>

```typescript
import { KnowledgeBaseConfiguration } from 'cdk-s3-vectors'

const knowledgeBaseConfiguration: KnowledgeBaseConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.KnowledgeBaseConfiguration.property.embeddingModelArn">embeddingModelArn</a></code> | <code>string</code> | The ARN (Amazon Resource Name) of the model used to create vector embeddings for the knowledge base. |
| <code><a href="#cdk-s3-vectors.KnowledgeBaseConfiguration.property.dimensions">dimensions</a></code> | <code>string</code> | The dimensions details for the vector configuration used on the Bedrock embeddings model. |
| <code><a href="#cdk-s3-vectors.KnowledgeBaseConfiguration.property.embeddingDataType">embeddingDataType</a></code> | <code>string</code> | The data type for the vectors when using a model to convert text into vector embeddings. |

---

##### `embeddingModelArn`<sup>Required</sup> <a name="embeddingModelArn" id="cdk-s3-vectors.KnowledgeBaseConfiguration.property.embeddingModelArn"></a>

```typescript
public readonly embeddingModelArn: string;
```

- *Type:* string

The ARN (Amazon Resource Name) of the model used to create vector embeddings for the knowledge base.

---

##### `dimensions`<sup>Optional</sup> <a name="dimensions" id="cdk-s3-vectors.KnowledgeBaseConfiguration.property.dimensions"></a>

```typescript
public readonly dimensions: string;
```

- *Type:* string

The dimensions details for the vector configuration used on the Bedrock embeddings model.

Must be supported by the chosen embedding model.

---

##### `embeddingDataType`<sup>Optional</sup> <a name="embeddingDataType" id="cdk-s3-vectors.KnowledgeBaseConfiguration.property.embeddingDataType"></a>

```typescript
public readonly embeddingDataType: string;
```

- *Type:* string

The data type for the vectors when using a model to convert text into vector embeddings.

The model must support the specified data type for vector embeddings.

Floating-point (float32) is the default data type, and is supported by most models for vector embeddings.
See [Supported embeddings models](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-supported.html)
for information on the available models and their vector data types.

---

### KnowledgeBaseProps <a name="KnowledgeBaseProps" id="cdk-s3-vectors.KnowledgeBaseProps"></a>

#### Initializer <a name="Initializer" id="cdk-s3-vectors.KnowledgeBaseProps.Initializer"></a>

```typescript
import { KnowledgeBaseProps } from 'cdk-s3-vectors'

const knowledgeBaseProps: KnowledgeBaseProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.KnowledgeBaseProps.property.indexArn">indexArn</a></code> | <code>string</code> | The ARN (Amazon Resource Name) of the vector index used for the knowledge base. |
| <code><a href="#cdk-s3-vectors.KnowledgeBaseProps.property.knowledgeBaseConfiguration">knowledgeBaseConfiguration</a></code> | <code><a href="#cdk-s3-vectors.KnowledgeBaseConfiguration">KnowledgeBaseConfiguration</a></code> | Contains details about the vector embeddings configuration of the knowledge base. |
| <code><a href="#cdk-s3-vectors.KnowledgeBaseProps.property.knowledgeBaseName">knowledgeBaseName</a></code> | <code>string</code> | The name of the knowledge base to create. |
| <code><a href="#cdk-s3-vectors.KnowledgeBaseProps.property.vectorBucketArn">vectorBucketArn</a></code> | <code>string</code> | The ARN (Amazon Resource Name) of the S3 bucket where vector embeddings are stored. |
| <code><a href="#cdk-s3-vectors.KnowledgeBaseProps.property.clientToken">clientToken</a></code> | <code>string</code> | A unique, case-sensitive identifier to ensure that the API request completes no more than one time. |
| <code><a href="#cdk-s3-vectors.KnowledgeBaseProps.property.description">description</a></code> | <code>string</code> | A description of the knowledge base. |

---

##### `indexArn`<sup>Required</sup> <a name="indexArn" id="cdk-s3-vectors.KnowledgeBaseProps.property.indexArn"></a>

```typescript
public readonly indexArn: string;
```

- *Type:* string

The ARN (Amazon Resource Name) of the vector index used for the knowledge base.

This ARN identifies the specific vector index resource within Amazon Bedrock.

---

##### `knowledgeBaseConfiguration`<sup>Required</sup> <a name="knowledgeBaseConfiguration" id="cdk-s3-vectors.KnowledgeBaseProps.property.knowledgeBaseConfiguration"></a>

```typescript
public readonly knowledgeBaseConfiguration: KnowledgeBaseConfiguration;
```

- *Type:* <a href="#cdk-s3-vectors.KnowledgeBaseConfiguration">KnowledgeBaseConfiguration</a>

Contains details about the vector embeddings configuration of the knowledge base.

---

##### `knowledgeBaseName`<sup>Required</sup> <a name="knowledgeBaseName" id="cdk-s3-vectors.KnowledgeBaseProps.property.knowledgeBaseName"></a>

```typescript
public readonly knowledgeBaseName: string;
```

- *Type:* string

The name of the knowledge base to create.

---

##### `vectorBucketArn`<sup>Required</sup> <a name="vectorBucketArn" id="cdk-s3-vectors.KnowledgeBaseProps.property.vectorBucketArn"></a>

```typescript
public readonly vectorBucketArn: string;
```

- *Type:* string

The ARN (Amazon Resource Name) of the S3 bucket where vector embeddings are stored.

This bucket contains the vector data used by the knowledge base.

---

##### `clientToken`<sup>Optional</sup> <a name="clientToken" id="cdk-s3-vectors.KnowledgeBaseProps.property.clientToken"></a>

```typescript
public readonly clientToken: string;
```

- *Type:* string

A unique, case-sensitive identifier to ensure that the API request completes no more than one time.

Must have length greater than or equal to 33.

If this token matches a previous request, Amazon Bedrock ignores the request, but does not return an error.
For more information, see [Ensuring Idempotency](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/Run_Instance_Idempotency.html).

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-s3-vectors.KnowledgeBaseProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

A description of the knowledge base.

---

### MetadataConfiguration <a name="MetadataConfiguration" id="cdk-s3-vectors.MetadataConfiguration"></a>

#### Initializer <a name="Initializer" id="cdk-s3-vectors.MetadataConfiguration.Initializer"></a>

```typescript
import { MetadataConfiguration } from 'cdk-s3-vectors'

const metadataConfiguration: MetadataConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.MetadataConfiguration.property.nonFilterableMetadataKeys">nonFilterableMetadataKeys</a></code> | <code>string[]</code> | Non-filterable metadata keys allow you to enrich vectors with additional context during storage and retrieval. |

---

##### `nonFilterableMetadataKeys`<sup>Required</sup> <a name="nonFilterableMetadataKeys" id="cdk-s3-vectors.MetadataConfiguration.property.nonFilterableMetadataKeys"></a>

```typescript
public readonly nonFilterableMetadataKeys: string[];
```

- *Type:* string[]

Non-filterable metadata keys allow you to enrich vectors with additional context during storage and retrieval.

Unlike default metadata keys, these keys can't be used as query filters.

Non-filterable metadata keys can be retrieved but can't be searched, queried, or filtered.
You can access non-filterable metadata keys of your vectors after finding the vectors.
For more information about non-filterable metadata keys, see
[Vectors](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-vectors.html) and
[Limitations and restrictions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-limitations.html)
in the *Amazon S3 User Guide*.

---



