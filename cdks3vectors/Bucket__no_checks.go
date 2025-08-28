//go:build no_runtime_type_checking

package cdks3vectors

// Building without runtime type checking enabled, so all the below just return nil

func (b *jsiiProxy_Bucket) validateGrantListIndexesParameters(grantee awsiam.IGrantable) error {
	return nil
}

func validateBucket_IsConstructParameters(x interface{}) error {
	return nil
}

func validateNewBucketParameters(scope constructs.Construct, id *string, props *BucketProps) error {
	return nil
}

