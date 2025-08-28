//go:build no_runtime_type_checking

package cdks3vectors

// Building without runtime type checking enabled, so all the below just return nil

func (i *jsiiProxy_Index) validateGrantWriteParameters(grantee awsiam.IGrantable) error {
	return nil
}

func validateIndex_IsConstructParameters(x interface{}) error {
	return nil
}

func validateNewIndexParameters(scope constructs.Construct, id *string, props *IndexProps) error {
	return nil
}

