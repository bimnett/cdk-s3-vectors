package cdks3vectors


type KnowledgeBaseProps struct {
	// The ARN (Amazon Resource Name) of the vector index used for the knowledge base.
	//
	// This ARN identifies the specific vector index resource within Amazon Bedrock.
	IndexArn *string `field:"required" json:"indexArn" yaml:"indexArn"`
	// Contains details about the vector embeddings configuration of the knowledge base.
	KnowledgeBaseConfiguration *KnowledgeBaseConfiguration `field:"required" json:"knowledgeBaseConfiguration" yaml:"knowledgeBaseConfiguration"`
	// The name of the knowledge base to create.
	KnowledgeBaseName *string `field:"required" json:"knowledgeBaseName" yaml:"knowledgeBaseName"`
	// The ARN (Amazon Resource Name) of the S3 bucket where vector embeddings are stored.
	//
	// This bucket contains the vector data used by the knowledge base.
	VectorBucketArn *string `field:"required" json:"vectorBucketArn" yaml:"vectorBucketArn"`
	// A unique, case-sensitive identifier to ensure that the API request completes no more than one time.
	//
	// Must have length greater than or equal to 33.
	//
	// If this token matches a previous request, Amazon Bedrock ignores the request, but does not return an error.
	// For more information, see [Ensuring Idempotency](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/Run_Instance_Idempotency.html).
	ClientToken *string `field:"optional" json:"clientToken" yaml:"clientToken"`
	// A description of the knowledge base.
	Description *string `field:"optional" json:"description" yaml:"description"`
}

