using Amazon.CDK;
using Amazon.CDK.AWS.KMS;
using Amazon.CDK.AWS.S3;
using Amazon.CDK.AWS.Bedrock;
using Constructs;
using s3Vectors = bimnett.CdkS3Vectors;

namespace S3VectorsExample
{
    public class S3VectorsStack : Stack
    {
        internal S3VectorsStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            // Create S3 bucket for storing documents
            var documentBucket = new Bucket(this, "DocumentBucket", new BucketProps
            {
                EnforceSSL = true,
                Versioned = false
            });

            // **MISSING ELEMENT #1: Create S3 bucket for storing supplemental data**
            var supplementalDataBucket = new Bucket(this, "SupplementalDataBucket", new BucketProps
            {
                EnforceSSL = true,
                Versioned = false
            });

            // Create KMS key for encryption (optional)
            var encryptionKey = new Key(this, "VectorBucketKey", new KeyProps
            {
                Description = "KMS key for S3 vector bucket encryption",
                EnableKeyRotation = true
            });

            // Create a vector bucket with all options
            var vectorBucket = new s3Vectors.Bucket(this, "VectorBucket", new s3Vectors.BucketProps
            {
                VectorBucketName = "my-vector-bucket", // REQUIRED
                // Optional encryption configuration
                EncryptionConfiguration = new s3Vectors.EncryptionConfiguration
                {
                    SseType = "aws:kms", // 'AES256' | 'aws:kms'
                    KmsKey = encryptionKey // Required when sseType is 'aws:kms'
                }
            });

            // Create a vector index with all options
            var vectorIndex = new s3Vectors.Index(this, "VectorIndex", new s3Vectors.IndexProps
            {
                VectorBucketName = vectorBucket.VectorBucketName, // REQUIRED
                IndexName = "my-index", // REQUIRED
                DataType = "float32", // REQUIRED (only 'float32' supported)
                Dimension = 1024, // REQUIRED (1-4096)
                DistanceMetric = "cosine", // REQUIRED ('euclidean' | 'cosine'
                // Optional metadata configuration
                MetadataConfiguration = new s3Vectors.MetadataConfiguration
                {
                    NonFilterableMetadataKeys = new[] { "source", "timestamp", "category" }
                }
            });
            // REQUIRED - add dependency for vector index
            vectorIndex.Node.AddDependency(vectorBucket);

            // Create a knowledge base with all options
            var knowledgeBase = new s3Vectors.KnowledgeBase(this, "KnowledgeBase", new s3Vectors.KnowledgeBaseProps
            {
                KnowledgeBaseName = "my-knowledge-base", // REQUIRED
                VectorBucketArn = vectorBucket.VectorBucketArn, // REQUIRED
                IndexArn = vectorIndex.IndexArn, // REQUIRED
                // REQUIRED knowledge base configuration
                KnowledgeBaseConfiguration = new s3Vectors.KnowledgeBaseConfiguration
                {
                    EmbeddingModelArn = "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0", // REQUIRED
                    EmbeddingDataType = "FLOAT32", // Optional: 'BINARY' | 'FLOAT32'
                    Dimensions = "1024", // Optional: dimensions as string
                    // Supplemental Data Configuration
                    SupplementalDataStorageConfiguration = new s3Vectors.SupplementalDataStorageConfiguration
                    {
                        S3Location = $"s3://{supplementalDataBucket.BucketName}"
                    }
                },
                // Optional fields
                Description = "Knowledge base for vector similarity search using S3 Vectors",
                ClientToken = "unique-client-token-12345678901234567890123456789012345" // Must be >= 33 characters
            });
            
            // REQUIRED - add dependencies for knowledge base
            knowledgeBase.Node.AddDependency(vectorIndex);
            knowledgeBase.Node.AddDependency(vectorBucket);
            // **MISSING ELEMENT #3: Add dependency for supplemental data bucket**
            knowledgeBase.Node.AddDependency(supplementalDataBucket);


            // Create data source for knowledge base
            var dataSource = new CfnDataSource(this, "DataSource", new CfnDataSourceProps
            {
                Name = "my-data-source",
                KnowledgeBaseId = knowledgeBase.KnowledgeBaseId,
                DataSourceConfiguration = new CfnDataSource.DataSourceConfigurationProperty
                {
                    Type = "S3",
                    S3Configuration = new CfnDataSource.S3DataSourceConfigurationProperty
                    {
                        BucketArn = documentBucket.BucketArn
                    }
                }
            });

            // Add dependencies for data source
            dataSource.Node.AddDependency(knowledgeBase);
            dataSource.Node.AddDependency(documentBucket);

            // Allow knowledge base to read from S3 buckets
            documentBucket.GrantRead(knowledgeBase.Role);
            // Grant ReadWrite permission to supplemental data bucket
            supplementalDataBucket.GrantReadWrite(knowledgeBase.Role);
        }
    }
}