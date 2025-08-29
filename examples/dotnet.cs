using Amazon.CDK;
using Amazon.CDK.AWS.KMS;
using Constructs;
using s3Vectors = bimnett.CdkS3Vectors;

namespace S3VectorsExample
{
    public class S3VectorsStack : Stack
    {
        internal S3VectorsStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
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
                    Dimensions = "1024" // Optional: dimensions as string
                },
                // Optional fields
                Description = "Knowledge base for vector similarity search using S3 Vectors",
                ClientToken = "unique-client-token-12345678901234567890123456789012345" // Must be >= 33 characters
            });
            knowledgeBase.Node.AddDependency(vectorIndex);
            knowledgeBase.Node.AddDependency(vectorBucket);
        }
    }
}