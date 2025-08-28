package cdks3vectors


type BucketProps struct {
	// The name of the vector bucket to create.
	VectorBucketName *string `field:"required" json:"vectorBucketName" yaml:"vectorBucketName"`
	// The encryption configuration for the vector bucket.
	//
	// By default, if you don't specify, all new vectors in Amazon S3 vector buckets use
	// server-side encryption with Amazon S3 managed keys (SSE-S3), specifically `AES256`.
	EncryptionConfiguration *EncryptionConfiguration `field:"optional" json:"encryptionConfiguration" yaml:"encryptionConfiguration"`
}

