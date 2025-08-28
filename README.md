# cdk-s3-vectors

![AWS CDK v2](https://img.shields.io/badge/AWS%20CDK-v2-orange.svg?style=for-the-badge)
![npm version](https://img.shields.io/npm/v/cdk-s3-vectors.svg?style=for-the-badge)
![PyPI version](https://img.shields.io/pypi/v/cdk-s3-vectors.svg?style=for-the-badge)
![NuGet version](https://img.shields.io/nuget/v/bimnett.CdkS3Vectors.svg?style=for-the-badge)


> **⚠️ Maintenance Notice**: This library is intended as a temporary solution and will only be maintained until AWS CloudFormation and CDK introduce native support for Amazon S3 Vectors. Once native support is available, users are encouraged to migrate to the official AWS constructs.

## Reference Documentation

[Amazon S3 Vectors User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors.html)

## Supported Languages

| Language | Package |
|----------|---------|
| ![Python Logo](https://docs.aws.amazon.com/cdk/api/latest/img/python32.png) Python | `cdk-s3-vectors` |
| ![TypeScript Logo](https://docs.aws.amazon.com/cdk/api/latest/img/typescript32.png) TypeScript | `cdk-s3-vectors` |
| ![.NET Logo](https://docs.aws.amazon.com/cdk/api/latest/img/dotnet32.png) .NET | `bimnett.CdkS3Vectors` |

## Overview

Amazon S3 Vectors is in preview release and provides native vector storage and similarity search capabilities within Amazon S3.

This AWS CDK construct library provides high-level constructs for Amazon S3 Vectors, enabling you to create vector buckets, indexes, and knowledge bases for AI/ML applications.

The library includes three main constructs:

- **Bucket**: Creates S3 vector buckets with optional encryption
- **Index**: Creates vector indexes within buckets for similarity search
- **KnowledgeBase**: Creates Amazon Bedrock knowledge bases using S3 Vectors as the vector store

## Examples

For complete, deployable examples in all supported languages, see the [examples directory](examples/).

## Bucket Construct Props

| Name | Type | Description |
|------|------|-------------|
| `vectorBucketName` | `string` | The name of the vector bucket to create. |
| `encryptionConfiguration?` | `EncryptionConfiguration` | Optional encryption configuration for the vector bucket. Defaults to AES256. |

## Index Construct Props

| Name | Type | Description |
|------|------|-------------|
| `vectorBucketName` | `string` | The name of the vector bucket to create the index in. |
| `indexName` | `string` | The name of the vector index to create. |
| `dataType` | `'float32'` | The data type of the vectors in the index. |
| `dimension` | `number` | The dimensions of the vectors (1-4096). |
| `distanceMetric` | `'euclidean' \| 'cosine'` | The distance metric for similarity search. |
| `metadataConfiguration?` | `MetadataConfiguration` | Optional metadata configuration for the index. |

## KnowledgeBase Construct Props

| Name | Type | Description |
|------|------|-------------|
| `knowledgeBaseName` | `string` | The name of the knowledge base to create. |
| `knowledgeBaseConfiguration` | `KnowledgeBaseConfiguration` | Vector embeddings configuration details. |
| `vectorBucketArn` | `string` | The ARN of the S3 vector bucket. |
| `indexArn` | `string` | The ARN of the vector index. |
| `description?` | `string` | Optional description of the knowledge base. |
| `clientToken?` | `string` | Optional idempotency token (≥33 characters). |

## Pattern Properties

| Name | Type | Description |
|------|------|-------------|
| `vectorBucketName` | `string` | Returns the name of the created vector bucket |
| `vectorBucketArn` | `string` | Returns the ARN of the created vector bucket |
| `indexArn` | `string` | Returns the ARN of the created vector index |
| `indexName` | `string` | Returns the name of the created vector index |
| `knowledgeBaseId` | `string` | Returns the ID of the created knowledge base |
| `knowledgeBaseArn` | `string` | Returns the ARN of the created knowledge base |

## Default Settings

Out of the box implementation of the constructs without any override will set the following defaults:

### Amazon S3 Vector Bucket

- Server-side encryption with Amazon S3 managed keys (SSE-S3) using AES256
- Least privilege IAM permissions for vector operations
- Custom resource handlers for bucket lifecycle management

### Vector Index

- Support for float32 data type vectors
- Configurable dimensions (1-4096)
- Choice of euclidean or cosine distance metrics
- Optional metadata configuration for enhanced search capabilities

### Amazon Bedrock Knowledge Base

- Integration with S3 Vectors as the vector store
- Configurable embedding models
- IAM role with least privilege permissions
- Support for various embedding data types and dimensions

## Architecture

```mermaid
graph TB
    subgraph "AWS Account"
        subgraph "S3 Vectors"
            VB[Vector Bucket]
            VI[Vector Index]
        end
        
        subgraph "Amazon Bedrock"
            KB[Knowledge Base]
            EM[Embedding Model]
        end
        
        subgraph "IAM"
            KBR[Knowledge Base Role]
            LR[Lambda Execution Roles]
        end
        
        subgraph "AWS Lambda"
            BH[Bucket Handler]
            IH[Index Handler] 
            KBH[Knowledge Base Handler]
        end
        
        subgraph "CloudFormation"
            CR1[Custom Resource 1]
            CR2[Custom Resource 2]
            CR3[Custom Resource 3]
        end
    end
    
    CR1 --> BH
    CR2 --> IH
    CR3 --> KBH
    
    BH --> VB
    IH --> VI
    KBH --> KB
    
    VI -.-> VB
    KB --> VI
    KB --> EM
    KB --> KBR
    
    KBR --> VB
    KBR --> VI
    
    LR --> BH
    LR --> IH
    LR --> KBH
```

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) file for details.