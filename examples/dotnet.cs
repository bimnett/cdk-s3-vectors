using Amazon.CDK;
using Amazon.CDK.AWS.KMS;
using Constructs;
using Bimnett.CdkS3Vectors;

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
            var vectorBucket = new Bucket(this, "VectorBucket", new BucketProps
            {
                VectorBucketName = "my-vector-bucket", // REQUIRED
                // Optional encryption configuration
                EncryptionConfiguration = new EncryptionConfiguration
                {
                    SseType = "aws:kms", // "AES256" | "aws:kms"
                    KmsKey = encryptionKey // Required when SseType is "aws:kms"
                }
            });

            // Create a vector index with all options
            var vectorIndex = new Index(this, "VectorIndex", new IndexProps
            {
                VectorBucketName = vectorBucket.VectorBucketName, // REQUIRED
                IndexName = "my-index", // REQUIRED
                DataType = "float32", // REQUIRED (only "float32" supported)
                Dimension = 1536, // REQUIRED (1-4096)
                DistanceMetric = "cosine", // REQUIRED ("euclidean" | "cosine")
                // Optional metadata configuration
                MetadataConfiguration = new MetadataConfiguration
                {
                    NonFilterableMetadataKeys = new[] { "source", "timestamp", "category" }
                }
            });
            vectorIndex.Node.AddDependency(vectorBucket);

            // Create a knowledge base with all options
            var knowledgeBase = new KnowledgeBase(this, "KnowledgeBase", new KnowledgeBaseProps
            {
                KnowledgeBaseName = "my-knowledge-base", // REQUIRED
                VectorBucketArn = vectorBucket.VectorBucketArn, // REQUIRED
                IndexArn = vectorIndex.IndexArn, // REQUIRED
                // REQUIRED knowledge base configuration
                KnowledgeBaseConfiguration = new KnowledgeBaseConfiguration
                {
                    EmbeddingModelArn = "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1", // REQUIRED
                    EmbeddingDataType = "FLOAT32", // Optional: "BINARY" | "FLOAT32"
                    Dimensions = "1536" // Optional: dimensions as string
                },
                // Optional fields
                Description = "Knowledge base for vector similarity search using S3 Vectors",
                ClientToken = "unique-client-token-12345678901234567890123456789012345" // Optional: ≥33 characters for idempotency
            });
            knowledgeBase.Node.AddDependency(vectorIndex);
            knowledgeBase.Node.AddDependency(vectorBucket);
        }
    }
}