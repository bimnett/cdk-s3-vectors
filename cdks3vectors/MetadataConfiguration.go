package cdks3vectors


type MetadataConfiguration struct {
	// Non-filterable metadata keys allow you to enrich vectors with additional context during storage and retrieval.
	//
	// Unlike default metadata keys, these keys can't be used as query filters.
	//
	// Non-filterable metadata keys can be retrieved but can't be searched, queried, or filtered.
	// You can access non-filterable metadata keys of your vectors after finding the vectors.
	// For more information about non-filterable metadata keys, see
	// [Vectors](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-vectors.html) and
	// [Limitations and restrictions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-limitations.html)
	// in the *Amazon S3 User Guide*.
	NonFilterableMetadataKeys *[]*string `field:"required" json:"nonFilterableMetadataKeys" yaml:"nonFilterableMetadataKeys"`
}

