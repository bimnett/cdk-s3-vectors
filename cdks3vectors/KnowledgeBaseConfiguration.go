package cdks3vectors


type KnowledgeBaseConfiguration struct {
	// The ARN (Amazon Resource Name) of the model used to create vector embeddings for the knowledge base.
	EmbeddingModelArn *string `field:"required" json:"embeddingModelArn" yaml:"embeddingModelArn"`
	// The dimensions details for the vector configuration used on the Bedrock embeddings model.
	//
	// Must be supported by the chosen embedding model.
	Dimensions *string `field:"optional" json:"dimensions" yaml:"dimensions"`
	// The data type for the vectors when using a model to convert text into vector embeddings.
	//
	// The model must support the specified data type for vector embeddings.
	//
	// Floating-point (float32) is the default data type, and is supported by most models for vector embeddings.
	// See [Supported embeddings models](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-supported.html)
	// for information on the available models and their vector data types.
	EmbeddingDataType *string `field:"optional" json:"embeddingDataType" yaml:"embeddingDataType"`
}

