import software.constructs.Construct;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.kms.Key;
import software.amazon.awscdk.services.kms.KeyProps;
import io.github.bimnett.cdks3vectors.*;
import java.util.Arrays;

public class S3VectorsStack extends Stack {
    public S3VectorsStack(final Construct scope, final String id) {
        this(scope, id, null);
    }

    public S3VectorsStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // Create KMS key for encryption (optional)
        Key encryptionKey = new Key(this, "VectorBucketKey", KeyProps.builder()
            .description("KMS key for S3 vector bucket encryption")
            .enableKeyRotation(true)
            .build());

        // Create a vector bucket with all options
        Bucket vectorBucket = new Bucket(this, "VectorBucket", BucketProps.builder()
            .vectorBucketName("my-vector-bucket") // REQUIRED
            // Optional encryption configuration
            .encryptionConfiguration(EncryptionConfiguration.builder()
                .sseType("aws:kms") // "AES256" | "aws:kms"
                .kmsKey(encryptionKey) // Required when sseType is "aws:kms"
                .build())
            .build());

        // Create a vector index with all options
        Index vectorIndex = new Index(this, "VectorIndex", IndexProps.builder()
            .vectorBucketName(vectorBucket.getVectorBucketName()) // REQUIRED
            .indexName("my-index") // REQUIRED
            .dataType("float32") // REQUIRED (only "float32" supported)
            .dimension(1536) // REQUIRED (1-4096)
            .distanceMetric("cosine") // REQUIRED ("euclidean" | "cosine")
            // Optional metadata configuration
            .metadataConfiguration(MetadataConfiguration.builder()
                .nonFilterableMetadataKeys(Arrays.asList("source", "timestamp", "category"))
                .build())
            .build());
        vectorIndex.getNode().addDependency(vectorBucket);

        // Create a knowledge base with all options
        KnowledgeBase knowledgeBase = new KnowledgeBase(this, "KnowledgeBase", 
            KnowledgeBaseProps.builder()
                .knowledgeBaseName("my-knowledge-base") // REQUIRED
                .vectorBucketArn(vectorBucket.getVectorBucketArn()) // REQUIRED
                .indexArn(vectorIndex.getIndexArn()) // REQUIRED
                // REQUIRED knowledge base configuration
                .knowledgeBaseConfiguration(KnowledgeBaseConfiguration.builder()
                    .embeddingModelArn("arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1") // REQUIRED
                    .embeddingDataType("FLOAT32") // Optional: "BINARY" | "FLOAT32"
                    .dimensions("1536") // Optional: dimensions as string
                    .build())
                // Optional fields
                .description("Knowledge base for vector similarity search using S3 Vectors")
                .clientToken("unique-client-token-12345678901234567890123456789012345") // Optional: ≥33 characters for idempotency
                .build());
        knowledgeBase.getNode().addDependency(vectorIndex);
        knowledgeBase.getNode().addDependency(vectorBucket);
    }
}