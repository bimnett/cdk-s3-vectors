import software.constructs.Construct;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.kms.Key;
import software.amazon.awscdk.services.s3.Bucket;
import software.amazon.awscdk.services.bedrock.CfnDataSource;
import io.github.bimnett.cdks3vectors.*;

import java.util.List;
import java.util.Map;

public class java extends Stack {
    public java(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // Create S3 bucket for storing documents
        Bucket documentBucket = Bucket.Builder.create(this, "DocumentBucket")
                .enforceSsl(true)
                .versioned(false)
                .build();

        // Create S3 bucket for storing supplemental data
        Bucket supplementalDataBucket = Bucket.Builder.create(this, "SupplementalDataBucket")
                .enforceSsl(true)
                .versioned(false)
                .build();

        // Create KMS key for encryption (optional)
        Key encryptionKey = Key.Builder.create(this, "VectorBucketKey")
                .description("KMS key for S3 vector bucket encryption")
                .enableKeyRotation(true)
                .build();

        // Create a vector bucket with all options
        // Renamed to 'S3VectorsBucket' to avoid collision with s3.Bucket
        Bucket_ vectorBucket = Bucket_.Builder.create(this, "VectorBucket") 
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
                        "dimensions", "1024", // Optional: dimensions as string
                        // Supplemental Data Configuration
                        "supplementalDataStorageConfiguration", Map.of( 
                            "s3Location", "s3://" + supplementalDataBucket.getBucketName()
                        )
                ))
                .description("Knowledge base for vector similarity search using S3 Vectors")
                .clientToken("unique-client-token-12345678901234567890123456789012345") // Must be >= 33 characters
                .build();

        // REQUIRED - add dependencies for knowledge base
        knowledgeBase.getNode().addDependency(vectorIndex);
        knowledgeBase.getNode().addDependency(vectorBucket);
        // Add dependency for supplemental data bucket
        knowledgeBase.getNode().addDependency(supplementalDataBucket); 

        // Create data source for knowledge base
        CfnDataSource dataSource = CfnDataSource.Builder.create(this, "DataSource")
                .name("my-data-source")
                .knowledgeBaseId(knowledgeBase.getKnowledgeBaseId())
                .dataSourceConfiguration(Map.of(
                        "type", "S3",
                        "s3Configuration", Map.of(
                                "bucketArn", documentBucket.getBucketArn()
                        )
                ))
                .build();
        
        // **MISSING ELEMENT #5: Add dependencies for data source**
        dataSource.getNode().addDependency(knowledgeBase);
        dataSource.getNode().addDependency(documentBucket);

        // Allow knowledge base to read from document bucket
        documentBucket.grantRead(knowledgeBase.getRole());
        // Grant ReadWrite permission to supplemental data bucket
        supplementalDataBucket.grantReadWrite(knowledgeBase.getRole());
    }
}