package cdks3vectors


type IndexProps struct {
	// The data type of the vectors in the index.
	//
	// Must be 'float32'.
	DataType *string `field:"required" json:"dataType" yaml:"dataType"`
	// The dimensions of the vectors to be inserted into the vector index.
	Dimension *float64 `field:"required" json:"dimension" yaml:"dimension"`
	// The distance metric to be used for similarity search.
	DistanceMetric *string `field:"required" json:"distanceMetric" yaml:"distanceMetric"`
	// The name of the vector index to create.
	IndexName *string `field:"required" json:"indexName" yaml:"indexName"`
	// The name of the vector bucket to create the vector index in.
	VectorBucketName *string `field:"required" json:"vectorBucketName" yaml:"vectorBucketName"`
	// The metadata configuration for the vector index.
	MetadataConfiguration *MetadataConfiguration `field:"optional" json:"metadataConfiguration" yaml:"metadataConfiguration"`
}

