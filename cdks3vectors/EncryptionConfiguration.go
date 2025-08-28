package cdks3vectors

import (
	"github.com/aws/aws-cdk-go/awscdk/v2/awskms"
)

type EncryptionConfiguration struct {
	// The server-side encryption type. Must be `AES256` or `aws:kms`.
	//
	// By default, if you don't specify, all new vectors in Amazon S3 vector buckets use
	// server-side encryption with Amazon S3 managed keys (SSE-S3), specifically `AES256`.
	SseType *string `field:"required" json:"sseType" yaml:"sseType"`
	// The AWS Key Management Service (KMS) customer managed key to use for server-side encryption.
	//
	// This parameter is allowed if and **only** if `sseType` is set to `aws:kms`.
	KmsKey awskms.IKey `field:"optional" json:"kmsKey" yaml:"kmsKey"`
}

