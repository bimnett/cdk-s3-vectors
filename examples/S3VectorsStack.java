package com.myorg;

import software.constructs.Construct;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.kms.Key;
import io.github.bimnett.cdks3vectors.*;
import java.util.Arrays;

public class S3VectorsStack extends Stack {
    public S3VectorsStack(final Construct scope, final String id) {
        this(scope, id, null);
    }

    public S3VectorsStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // Create KMS key for encryption
        Key encryptionKey = Key.Builder.create(this, "VectorBucketKey")
                .description("KMS key for S3 vector bucket encryption")
                .enableKeyRotation(true)
                .build();

        // Create a vector bucket
        io.github.bimnett.cdks3vectors.Bucket vectorBucket = new Bucket(this, "VectorBucket", BucketProps.builder()
                .vectorBucketName("my-vector-bucket")
                .encryptionConfiguration(EncryptionConfiguration.builder()
                        .sseType("aws:kms")
                        .kmsKey(encryptionKey)
                        .build())
                .build());

        // Create a vector index
        io.github.bimnett.cdks3vectors.Index vectorIndex = new Index(this, "VectorIndex", IndexProps.builder()
                .vectorBucketName(vectorBucket.getVectorBucketName())
                .indexName("my-index")
                .dataType("float32")
                .dimension(1024)
                .distanceMetric("cosine")
                .metadataConfiguration(MetadataConfiguration.builder()
                        .nonFilterableMetadataKeys(Arrays.asList("source", "timestamp", "category"))
                        .build())
                .build());
        vectorIndex.getNode().addDependency(vectorBucket);

        // Create a knowledge base
        io.github.bimnett.cdks3vectors.KnowledgeBase knowledgeBase = new KnowledgeBase(this, "KnowledgeBase", KnowledgeBaseProps.builder()
                .knowledgeBaseName("my-knowledge-base")
                .vectorBucketArn(vectorBucket.getVectorBucketArn())
                .indexArn(vectorIndex.getIndexArn())
                .knowledgeBaseConfiguration(KnowledgeBaseConfiguration.builder()
                        .embeddingModelArn("arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0")
                        .embeddingDataType("FLOAT32")
                        .dimensions("1024")
                        .build())
                .description("Knowledge base for vector similarity search using S3 Vectors")
                .clientToken("unique-client-token-12345678901234567890123456789012345")
                .build());
        knowledgeBase.getNode().addDependency(vectorIndex);
        knowledgeBase.getNode().addDependency(vectorBucket);
    }
}