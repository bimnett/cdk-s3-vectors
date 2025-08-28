package main

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awskms"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/bimnett/cdk-s3-vectors/cdks3vectors"
	"github.com/aws/jsii-runtime-go"
)

type S3VectorsStackProps struct {
	awscdk.StackProps
}

func NewS3VectorsStack(scope constructs.Construct, id string, props *S3VectorsStackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)

	// Create KMS key for encryption (optional)
	encryptionKey := awskms.NewKey(stack, jsii.String("VectorBucketKey"), &awskms.KeyProps{
		Description:       jsii.String("KMS key for S3 vector bucket encryption"),
		EnableKeyRotation: jsii.Bool(true),
	})

	// Create a vector bucket with all options
	vectorBucket := cdks3vectors.NewBucket(stack, jsii.String("VectorBucket"), &cdks3vectors.BucketProps{
		VectorBucketName: jsii.String("my-vector-bucket"), // REQUIRED
		// Optional encryption configuration
		EncryptionConfiguration: &cdks3vectors.EncryptionConfiguration{
			SseType: jsii.String("aws:kms"), // "AES256" | "aws:kms"
			KmsKey:  encryptionKey,          // Required when SseType is "aws:kms"
		},
	})

	// Create a vector index with all options
	vectorIndex := cdks3vectors.NewIndex(stack, jsii.String("VectorIndex"), &cdks3vectors.IndexProps{
		VectorBucketName: vectorBucket.VectorBucketName(), // REQUIRED
		IndexName:        jsii.String("my-index"),         // REQUIRED
		DataType:         jsii.String("float32"),          // REQUIRED (only "float32" supported)
		Dimension:        jsii.Number(1536),               // REQUIRED (1-4096)
		DistanceMetric:   jsii.String("cosine"),           // REQUIRED ("euclidean" | "cosine")
		// Optional metadata configuration
		MetadataConfiguration: &cdks3vectors.MetadataConfiguration{
			NonFilterableMetadataKeys: &[]*string{
				jsii.String("source"),
				jsii.String("timestamp"),
				jsii.String("category"),
			},
		},
	})
	vectorIndex.Node().AddDependency(vectorBucket)

	// Create a knowledge base with all options
	knowledgeBase := cdks3vectors.NewKnowledgeBase(stack, jsii.String("KnowledgeBase"), &cdks3vectors.KnowledgeBaseProps{
		KnowledgeBaseName: jsii.String("my-knowledge-base"), // REQUIRED
		VectorBucketArn:   vectorBucket.VectorBucketArn(),   // REQUIRED
		IndexArn:          vectorIndex.IndexArn(),           // REQUIRED
		// REQUIRED knowledge base configuration
		KnowledgeBaseConfiguration: &cdks3vectors.KnowledgeBaseConfiguration{
			EmbeddingModelArn:  jsii.String("arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1"), // REQUIRED
			EmbeddingDataType:  jsii.String("FLOAT32"), // Optional: "BINARY" | "FLOAT32"
			Dimensions:         jsii.String("1536"),    // Optional: dimensions as string
		},
		// Optional fields
		Description: jsii.String("Knowledge base for vector similarity search using S3 Vectors"),
		ClientToken: jsii.String("unique-client-token-12345678901234567890123456789012345"), // Optional: ≥33 characters for idempotency
	})
	knowledgeBase.Node().AddDependency(vectorIndex)
	knowledgeBase.Node().AddDependency(vectorBucket)

	return stack
}