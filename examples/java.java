import software.constructs.Construct;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.kms.Key;
import software.amazon.awscdk.services.s3.Bucket;
import software.amazon.awscdk.services.bedrock.CfnDataSource;
import io.github.bimnett.cdks3vectors.*;

import java.util.List;
import java.util.Map;

public class S3VectorsStack extends Stack {
    public S3VectorsStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // Create S3 bucket for storing documents
        Bucket documentBucket = Bucket.Builder.create(this, "document-bucket")
                .enforceSsl(true)
                .versioned(false)
                .build();

        // Create KMS key for encryption (optional)
        Key encryptionKey = Key.Builder.create(this, "VectorBucketKey")
                .description("KMS key for S3 vector bucket encryption")
                .enableKeyRotation(true)
                .build();

        // Create a vector bucket with all options
        Bucket_ vectorBucket = Bucket_.Builder.create(this, "VectorBucket") // renamed to avoid collision with s3.Bucket
                .vectorBucketName("my-vector-bucket") // REQUIRED
                .encryptionConfiguration(Map.of(
                        "sseType", "aws:kms",  // 'AES256' | 'aws:kms'
                        "kmsKey", encryptionKey // Required when sseType is 'aws:kms'
                ))
                .build();

        // Create a vector index with all options
        Index vectorIndex = Index.Builder.create(this, "VectorIndex")
                .vectorBucketName(vectorBucket.getVectorBucketName()) // REQUIRED
                .indexName("my-index") // REQUIRED
                .dataType("float32") // REQUIRED (only 'float32' supported)
                .dimension(1024) // REQUIRED (1-4096)
                .distanceMetric("cosine") // REQUIRED ('euclidean' | 'cosine')
                .metadataConfiguration(Map.of(
                        "nonFilterableMetadataKeys", List.of("source", "timestamp", "category")
                ))
                .build();

        // REQUIRED - add dependency for vector index
        vectorIndex.getNode().addDependency(vectorBucket);

        // Create a knowledge base with all options
        KnowledgeBase knowledgeBase = KnowledgeBase.Builder.create(this, "KnowledgeBase")
                .knowledgeBaseName("my-knowledge-base") // REQUIRED
                .vectorBucketArn(vectorBucket.getVectorBucketArn()) // REQUIRED
                .indexArn(vectorIndex.getIndexArn()) // REQUIRED
                .knowledgeBaseConfiguration(Map.of(
                        "embeddingModelArn", "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0", // REQUIRED
                        "embeddingDataType", "FLOAT32", // Optional: 'BINARY' | 'FLOAT32'
                        "dimensions", "1024" // Optional: dimensions as string
                ))
                .description("Knowledge base for vector similarity search using S3 Vectors")
                .clientToken("unique-client-token-12345678901234567890123456789012345") // Must be >= 33 characters
                .build();

        // REQUIRED - add dependencies for knowledge base
        knowledgeBase.getNode().addDependency(vectorIndex);
        knowledgeBase.getNode().addDependency(vectorBucket);

        // Create data source for knowledge base
        CfnDataSource dataSource = CfnDataSource.Builder.create(this, "data-source")
                .name("my-data-source")
                .knowledgeBaseId(knowledgeBase.getKnowledgeBaseId())
                .dataSourceConfiguration(Map.of(
                        "type", "S3",
                        "s3Configuration", Map.of(
                                "bucketArn", documentBucket.getBucketArn()
                        )
                ))
                .build();

        // Allow knowledge base to read from document bucket
        documentBucket.grantRead(knowledgeBase.getRole());
    }
}
