package cdks3vectors

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/bimnett/cdk-s3-vectors/cdks3vectors/jsii"

	"github.com/aws/aws-cdk-go/awscdk/v2/awsiam"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/bimnett/cdk-s3-vectors/cdks3vectors/internal"
)

// Creates a Amazon Bedrock knowledge base with S3 Vectors as the underlying vector store.
//
// To create a knowledge base, you must first set up and configure a S3 Vectors bucket and index.
// For more information, see [Set up a knowledge base](https://docs.aws.amazon.com/bedrock/latest/userguide/knowlege-base-prereq.html).
type KnowledgeBase interface {
	constructs.Construct
	// The Amazon Resource Name (ARN) of the knowledge base.
	KnowledgeBaseArn() *string
	// The ID of the knowledge base.
	KnowledgeBaseId() *string
	// The tree node.
	Node() constructs.Node
	// Grants permission to start an ingestion job for the knowledge base.
	GrantIngestion(grantee awsiam.IGrantable)
	// Returns a string representation of this construct.
	ToString() *string
}

// The jsii proxy struct for KnowledgeBase
type jsiiProxy_KnowledgeBase struct {
	internal.Type__constructsConstruct
}

func (j *jsiiProxy_KnowledgeBase) KnowledgeBaseArn() *string {
	var returns *string
	_jsii_.Get(
		j,
		"knowledgeBaseArn",
		&returns,
	)
	return returns
}

func (j *jsiiProxy_KnowledgeBase) KnowledgeBaseId() *string {
	var returns *string
	_jsii_.Get(
		j,
		"knowledgeBaseId",
		&returns,
	)
	return returns
}

func (j *jsiiProxy_KnowledgeBase) Node() constructs.Node {
	var returns constructs.Node
	_jsii_.Get(
		j,
		"node",
		&returns,
	)
	return returns
}


func NewKnowledgeBase(scope constructs.Construct, id *string, props *KnowledgeBaseProps) KnowledgeBase {
	_init_.Initialize()

	if err := validateNewKnowledgeBaseParameters(scope, id, props); err != nil {
		panic(err)
	}
	j := jsiiProxy_KnowledgeBase{}

	_jsii_.Create(
		"cdk-s3-vectors.KnowledgeBase",
		[]interface{}{scope, id, props},
		&j,
	)

	return &j
}

func NewKnowledgeBase_Override(k KnowledgeBase, scope constructs.Construct, id *string, props *KnowledgeBaseProps) {
	_init_.Initialize()

	_jsii_.Create(
		"cdk-s3-vectors.KnowledgeBase",
		[]interface{}{scope, id, props},
		k,
	)
}

// Checks if `x` is a construct.
//
// Returns: true if `x` is an object created from a class which extends `Construct`.
// Deprecated: use `x instanceof Construct` instead.
func KnowledgeBase_IsConstruct(x interface{}) *bool {
	_init_.Initialize()

	if err := validateKnowledgeBase_IsConstructParameters(x); err != nil {
		panic(err)
	}
	var returns *bool

	_jsii_.StaticInvoke(
		"cdk-s3-vectors.KnowledgeBase",
		"isConstruct",
		[]interface{}{x},
		&returns,
	)

	return returns
}

func (k *jsiiProxy_KnowledgeBase) GrantIngestion(grantee awsiam.IGrantable) {
	if err := k.validateGrantIngestionParameters(grantee); err != nil {
		panic(err)
	}
	_jsii_.InvokeVoid(
		k,
		"grantIngestion",
		[]interface{}{grantee},
	)
}

func (k *jsiiProxy_KnowledgeBase) ToString() *string {
	var returns *string

	_jsii_.Invoke(
		k,
		"toString",
		nil, // no parameters
		&returns,
	)

	return returns
}

