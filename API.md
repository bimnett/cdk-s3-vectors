# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Bucket <a name="Bucket" id="cdk-s3-vectors.Bucket"></a>

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

---

##### `toString` <a name="toString" id="cdk-s3-vectors.Bucket.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

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
| <code><a href="#cdk-s3-vectors.Bucket.property.bucketArn">bucketArn</a></code> | <code>string</code> | The ARN of the created S3 bucket. |
| <code><a href="#cdk-s3-vectors.Bucket.property.bucketName">bucketName</a></code> | <code>string</code> | The bucket where the vector data will be stored. |
| <code><a href="#cdk-s3-vectors.Bucket.property.region">region</a></code> | <code>string</code> | The AWS region where the resource will be created. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-s3-vectors.Bucket.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `bucketArn`<sup>Required</sup> <a name="bucketArn" id="cdk-s3-vectors.Bucket.property.bucketArn"></a>

```typescript
public readonly bucketArn: string;
```

- *Type:* string

The ARN of the created S3 bucket.

---

##### `bucketName`<sup>Required</sup> <a name="bucketName" id="cdk-s3-vectors.Bucket.property.bucketName"></a>

```typescript
public readonly bucketName: string;
```

- *Type:* string

The bucket where the vector data will be stored.

---

##### `region`<sup>Required</sup> <a name="region" id="cdk-s3-vectors.Bucket.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

The AWS region where the resource will be created.

---


### Index <a name="Index" id="cdk-s3-vectors.Index"></a>

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
| <code><a href="#cdk-s3-vectors.Index.property.indexArn">indexArn</a></code> | <code>string</code> | The ARN (Amazon Resource Name) of the created S3 Vector index. |
| <code><a href="#cdk-s3-vectors.Index.property.indexEndpoint">indexEndpoint</a></code> | <code>string</code> | The HTTPS endpoint for the S3 Vector index, used for making API calls. |
| <code><a href="#cdk-s3-vectors.Index.property.indexName">indexName</a></code> | <code>string</code> | The name for the index. |

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

The ARN (Amazon Resource Name) of the created S3 Vector index.

---

##### `indexEndpoint`<sup>Required</sup> <a name="indexEndpoint" id="cdk-s3-vectors.Index.property.indexEndpoint"></a>

```typescript
public readonly indexEndpoint: string;
```

- *Type:* string

The HTTPS endpoint for the S3 Vector index, used for making API calls.

---

##### `indexName`<sup>Required</sup> <a name="indexName" id="cdk-s3-vectors.Index.property.indexName"></a>

```typescript
public readonly indexName: string;
```

- *Type:* string

The name for the index.

---


### S3VectorKnowledgeBase <a name="S3VectorKnowledgeBase" id="cdk-s3-vectors.S3VectorKnowledgeBase"></a>

#### Initializers <a name="Initializers" id="cdk-s3-vectors.S3VectorKnowledgeBase.Initializer"></a>

```typescript
import { S3VectorKnowledgeBase } from 'cdk-s3-vectors'

new S3VectorKnowledgeBase(scope: Construct, id: string, props: S3VectorKnowledgeBaseProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBase.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - Represents the scope for all resources. |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBase.Initializer.parameter.id">id</a></code> | <code>string</code> | - Scope-unique id. |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBase.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBaseProps">S3VectorKnowledgeBaseProps</a></code> | - User provided props for the construct. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-s3-vectors.S3VectorKnowledgeBase.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

Represents the scope for all resources.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-s3-vectors.S3VectorKnowledgeBase.Initializer.parameter.id"></a>

- *Type:* string

Scope-unique id.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-s3-vectors.S3VectorKnowledgeBase.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-s3-vectors.S3VectorKnowledgeBaseProps">S3VectorKnowledgeBaseProps</a>

User provided props for the construct.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBase.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-s3-vectors.S3VectorKnowledgeBase.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBase.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-s3-vectors.S3VectorKnowledgeBase.isConstruct"></a>

```typescript
import { S3VectorKnowledgeBase } from 'cdk-s3-vectors'

S3VectorKnowledgeBase.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-s3-vectors.S3VectorKnowledgeBase.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBase.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBase.property.knowledgeBaseArn">knowledgeBaseArn</a></code> | <code>string</code> | The Amazon Resource Name (ARN) of the knowledge base. |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBase.property.knowledgeBaseId">knowledgeBaseId</a></code> | <code>string</code> | The ID of the knowledge base. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-s3-vectors.S3VectorKnowledgeBase.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `knowledgeBaseArn`<sup>Required</sup> <a name="knowledgeBaseArn" id="cdk-s3-vectors.S3VectorKnowledgeBase.property.knowledgeBaseArn"></a>

```typescript
public readonly knowledgeBaseArn: string;
```

- *Type:* string

The Amazon Resource Name (ARN) of the knowledge base.

---

##### `knowledgeBaseId`<sup>Required</sup> <a name="knowledgeBaseId" id="cdk-s3-vectors.S3VectorKnowledgeBase.property.knowledgeBaseId"></a>

```typescript
public readonly knowledgeBaseId: string;
```

- *Type:* string

The ID of the knowledge base.

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
| <code><a href="#cdk-s3-vectors.BucketProps.property.bucketName">bucketName</a></code> | <code>string</code> | The bucket where the vector data will be stored. |
| <code><a href="#cdk-s3-vectors.BucketProps.property.region">region</a></code> | <code>string</code> | The AWS region where the resource will be created. |
| <code><a href="#cdk-s3-vectors.BucketProps.property.encryptionConfiguration">encryptionConfiguration</a></code> | <code><a href="#cdk-s3-vectors.EncryptionConfiguration">EncryptionConfiguration</a></code> | The encryption configuration for the S3 Vector bucket. |

---

##### `bucketName`<sup>Required</sup> <a name="bucketName" id="cdk-s3-vectors.BucketProps.property.bucketName"></a>

```typescript
public readonly bucketName: string;
```

- *Type:* string

The bucket where the vector data will be stored.

---

##### `region`<sup>Required</sup> <a name="region" id="cdk-s3-vectors.BucketProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

The AWS region where the resource will be created.

---

##### `encryptionConfiguration`<sup>Optional</sup> <a name="encryptionConfiguration" id="cdk-s3-vectors.BucketProps.property.encryptionConfiguration"></a>

```typescript
public readonly encryptionConfiguration: EncryptionConfiguration;
```

- *Type:* <a href="#cdk-s3-vectors.EncryptionConfiguration">EncryptionConfiguration</a>

The encryption configuration for the S3 Vector bucket.

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
| <code><a href="#cdk-s3-vectors.EncryptionConfiguration.property.kmsKeyArn">kmsKeyArn</a></code> | <code>string</code> | The KMS key ARN to use for encryption. |
| <code><a href="#cdk-s3-vectors.EncryptionConfiguration.property.sseType">sseType</a></code> | <code>string</code> | The server-side encryption type. |

---

##### `kmsKeyArn`<sup>Required</sup> <a name="kmsKeyArn" id="cdk-s3-vectors.EncryptionConfiguration.property.kmsKeyArn"></a>

```typescript
public readonly kmsKeyArn: string;
```

- *Type:* string

The KMS key ARN to use for encryption.

---

##### `sseType`<sup>Required</sup> <a name="sseType" id="cdk-s3-vectors.EncryptionConfiguration.property.sseType"></a>

```typescript
public readonly sseType: string;
```

- *Type:* string

The server-side encryption type.

Must be 'aws:kms'.

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
| <code><a href="#cdk-s3-vectors.IndexProps.property.bucket">bucket</a></code> | <code><a href="#cdk-s3-vectors.Bucket">Bucket</a></code> | The S3 Vector Bucket construct where the index will be created. |
| <code><a href="#cdk-s3-vectors.IndexProps.property.dataType">dataType</a></code> | <code>string</code> | The data type of the vectors in the index. |
| <code><a href="#cdk-s3-vectors.IndexProps.property.dimension">dimension</a></code> | <code>number</code> | The number of dimensions for the vectors in the index. |
| <code><a href="#cdk-s3-vectors.IndexProps.property.distanceMetric">distanceMetric</a></code> | <code>string</code> | The distance metric to use for calculating similarity. |
| <code><a href="#cdk-s3-vectors.IndexProps.property.indexName">indexName</a></code> | <code>string</code> | The name of the vector index. |
| <code><a href="#cdk-s3-vectors.IndexProps.property.metadataConfiguration">metadataConfiguration</a></code> | <code><a href="#cdk-s3-vectors.MetadataConfiguration">MetadataConfiguration</a></code> | Optional metadata configuration for the index. |

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-s3-vectors.IndexProps.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* <a href="#cdk-s3-vectors.Bucket">Bucket</a>

The S3 Vector Bucket construct where the index will be created.

---

##### `dataType`<sup>Required</sup> <a name="dataType" id="cdk-s3-vectors.IndexProps.property.dataType"></a>

```typescript
public readonly dataType: string;
```

- *Type:* string

The data type of the vectors in the index.

---

##### `dimension`<sup>Required</sup> <a name="dimension" id="cdk-s3-vectors.IndexProps.property.dimension"></a>

```typescript
public readonly dimension: number;
```

- *Type:* number

The number of dimensions for the vectors in the index.

---

##### `distanceMetric`<sup>Required</sup> <a name="distanceMetric" id="cdk-s3-vectors.IndexProps.property.distanceMetric"></a>

```typescript
public readonly distanceMetric: string;
```

- *Type:* string

The distance metric to use for calculating similarity.

---

##### `indexName`<sup>Required</sup> <a name="indexName" id="cdk-s3-vectors.IndexProps.property.indexName"></a>

```typescript
public readonly indexName: string;
```

- *Type:* string

The name of the vector index.

---

##### `metadataConfiguration`<sup>Optional</sup> <a name="metadataConfiguration" id="cdk-s3-vectors.IndexProps.property.metadataConfiguration"></a>

```typescript
public readonly metadataConfiguration: MetadataConfiguration;
```

- *Type:* <a href="#cdk-s3-vectors.MetadataConfiguration">MetadataConfiguration</a>

Optional metadata configuration for the index.

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
| <code><a href="#cdk-s3-vectors.MetadataConfiguration.property.nonFilterableMetadataKeys">nonFilterableMetadataKeys</a></code> | <code>string[]</code> | A list of keys for metadata fields that should not be filterable. |

---

##### `nonFilterableMetadataKeys`<sup>Required</sup> <a name="nonFilterableMetadataKeys" id="cdk-s3-vectors.MetadataConfiguration.property.nonFilterableMetadataKeys"></a>

```typescript
public readonly nonFilterableMetadataKeys: string[];
```

- *Type:* string[]

A list of keys for metadata fields that should not be filterable.

---

### S3VectorKnowledgeBaseProps <a name="S3VectorKnowledgeBaseProps" id="cdk-s3-vectors.S3VectorKnowledgeBaseProps"></a>

#### Initializer <a name="Initializer" id="cdk-s3-vectors.S3VectorKnowledgeBaseProps.Initializer"></a>

```typescript
import { S3VectorKnowledgeBaseProps } from 'cdk-s3-vectors'

const s3VectorKnowledgeBaseProps: S3VectorKnowledgeBaseProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBaseProps.property.bucketProps">bucketProps</a></code> | <code><a href="#cdk-s3-vectors.BucketProps">BucketProps</a></code> | User provided props for the S3 vectors bucket construct. |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBaseProps.property.embeddingModelArn">embeddingModelArn</a></code> | <code>string</code> | The Amazon Resource Name (ARN) of the model used to create vector embeddings for the knowledge base. |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBaseProps.property.indexProps">indexProps</a></code> | <code><a href="#cdk-s3-vectors.IndexProps">IndexProps</a></code> | User provided props for the S3 vectors index construct. |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBaseProps.property.knowledgeBaseName">knowledgeBaseName</a></code> | <code>string</code> | The name of the knowledge base. |
| <code><a href="#cdk-s3-vectors.S3VectorKnowledgeBaseProps.property.description">description</a></code> | <code>string</code> | A description of the knowledge base. |

---

##### `bucketProps`<sup>Required</sup> <a name="bucketProps" id="cdk-s3-vectors.S3VectorKnowledgeBaseProps.property.bucketProps"></a>

```typescript
public readonly bucketProps: BucketProps;
```

- *Type:* <a href="#cdk-s3-vectors.BucketProps">BucketProps</a>

User provided props for the S3 vectors bucket construct.

---

##### `embeddingModelArn`<sup>Required</sup> <a name="embeddingModelArn" id="cdk-s3-vectors.S3VectorKnowledgeBaseProps.property.embeddingModelArn"></a>

```typescript
public readonly embeddingModelArn: string;
```

- *Type:* string

The Amazon Resource Name (ARN) of the model used to create vector embeddings for the knowledge base.

---

##### `indexProps`<sup>Required</sup> <a name="indexProps" id="cdk-s3-vectors.S3VectorKnowledgeBaseProps.property.indexProps"></a>

```typescript
public readonly indexProps: IndexProps;
```

- *Type:* <a href="#cdk-s3-vectors.IndexProps">IndexProps</a>

User provided props for the S3 vectors index construct.

---

##### `knowledgeBaseName`<sup>Required</sup> <a name="knowledgeBaseName" id="cdk-s3-vectors.S3VectorKnowledgeBaseProps.property.knowledgeBaseName"></a>

```typescript
public readonly knowledgeBaseName: string;
```

- *Type:* string

The name of the knowledge base.

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-s3-vectors.S3VectorKnowledgeBaseProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

A description of the knowledge base.

---



