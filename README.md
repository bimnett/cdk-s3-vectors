# cdk-s3-vectors

![AWS CDK v2](https://img.shields.io/badge/AWS%20CDK-v2-orange.svg?style=for-the-badge)
![npm version](https://img.shields.io/npm/v/cdk-s3-vectors.svg?style=for-the-badge)
![PyPI version](https://img.shields.io/pypi/v/cdk-s3-vectors.svg?style=for-the-badge)
![NuGet version](https://img.shields.io/nuget/v/bimnett.CdkS3Vectors.svg?style=for-the-badge)
![Maven Central](https://img.shields.io/maven-central/v/io.github.bimnett/cdk-s3-vectors.svg?style=for-the-badge)


> **⚠️ Maintenance Notice**: This library is intended as a temporary solution and will only be maintained until AWS CloudFormation and CDK introduce native support for Amazon S3 Vectors. Once native support is available, users are encouraged to migrate to the official AWS constructs.

## Reference Documentation
[Amazon S3 Vectors User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors.html)

## Overview

Amazon S3 Vectors is in preview release and provides native vector storage and similarity search capabilities within Amazon S3.

This AWS CDK construct library provides high-level constructs for Amazon S3 Vectors, enabling you to create vector buckets, indexes, and knowledge bases for AI/ML applications.

The library includes three main constructs:

- **Bucket**: Creates S3 vector buckets with optional encryption
- **Index**: Creates vector indexes within buckets for similarity search
- **KnowledgeBase**: Creates Amazon Bedrock knowledge bases using S3 Vectors as the vector store

## Getting Started

| Language | Package |
|----------|---------|
| ![Python Logo](https://docs.aws.amazon.com/cdk/api/latest/img/python32.png) Python | `pip install cdk-s3-vectors` |
| ![TypeScript Logo](https://docs.aws.amazon.com/cdk/api/latest/img/typescript32.png) TypeScript/JavaScript | `npm install cdk-s3-vectors` |
| ![.NET Logo](https://docs.aws.amazon.com/cdk/api/latest/img/dotnet32.png) .NET | `dotnet add package bimnett.CdkS3Vectors` |

For Java, add the following to your `pom.xml` file:
```xml
<dependency>
  <groupId>io.github.bimnett</groupId>
  <artifactId>cdk-s3-vectors</artifactId>
  <version>LATEST</version>
</dependency>
```

## Examples
For complete, deployable examples in all supported languages, see the [examples directory](examples/).

## API Reference
The API reference can be found [here](./API.md).


## Architecture

```mermaid
graph TD
    subgraph "CDK Application"
        A[Bucket Construct] --> B(S3 Vector Bucket)
        C[Index Construct] --> D(S3 Vector Index)
        E[KnowledgeBase Construct] --> F(Bedrock Knowledge Base)
    end

    subgraph "AWS Cloud"
        A -- defines --> G{Lambda}
        C -- defines --> G
        E -- defines --> G
        G -- uses --> H{S3 Vectors}
        G -- uses --> I{Bedrock}
        H --> J(Embedding Model)
    end

    G -- creates --> B
    G -- creates --> D
    G -- creates --> F
```

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) file for details.