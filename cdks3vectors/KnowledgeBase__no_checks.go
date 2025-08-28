//go:build no_runtime_type_checking

package cdks3vectors

// Building without runtime type checking enabled, so all the below just return nil

func (k *jsiiProxy_KnowledgeBase) validateGrantIngestionParameters(grantee awsiam.IGrantable) error {
	return nil
}

func validateKnowledgeBase_IsConstructParameters(x interface{}) error {
	return nil
}

func validateNewKnowledgeBaseParameters(scope constructs.Construct, id *string, props *KnowledgeBaseProps) error {
	return nil
}

