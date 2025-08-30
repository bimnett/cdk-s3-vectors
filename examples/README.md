# CDK S3 Vectors Examples

This directory contains complete examples for using the CDK S3 Vectors construct library in different programming languages.

**IMPORTANT:** The constructs library version must be >= 10.0.5.

## Available Examples

- **[TypeScript/JavaScript](typescript.ts)** - Complete TypeScript/Javascript implementation
- **[Python](python.py)** - Complete Python implementation  
- **[Java](#java.java)** - Complete Java implementation
- **[.NET/C#](dotnet.cs)** - Complete C# implementation

## Java Maven Dependency

Add the following dependency to your `pom.xml`:
```xml
<dependency>
    <groupId>io.github.bimnett</groupId>
    <artifactId>cdk-s3-vectors</artifactId>
    <version>LATEST</version> // Or a specific version
</dependency>
```

## Key Features Demonstrated

Each example shows how to:

1. **Create a vector bucket** with proper configuration
2. **Create a vector index** within the bucket
3. **Create a knowledge base** using the S3 Vectors as the vector store
4. **Set up proper dependencies** between constructs using `addDependency()`

## Important Notes

- All examples include proper dependency management to ensure resources are created in the correct order
- The knowledge base depends on both the vector bucket and index
- The vector index depends on the vector bucket
- Examples use the Amazon Titan embedding model - adjust the ARN for your preferred model