package cdks3vectors

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/bimnett/cdk-s3-vectors/cdks3vectors/jsii"

	"github.com/aws/aws-cdk-go/awscdk/v2/awsiam"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/bimnett/cdk-s3-vectors/cdks3vectors/internal"
)

// Amazon S3 Vectors is in preview release for Amazon S3 and is subject to change.
//
// Creates a vector index within a vector bucket.
// To specify the vector bucket, you must use either the vector bucket name or the vector bucket ARN (Amazon Resource Name).
type Index interface {
	constructs.Construct
	// The ARN (Amazon Resource Name) of the S3 Vector index.
	IndexArn() *string
	// The name of the index.
	IndexName() *string
	// The tree node.
	Node() constructs.Node
	// Grants write permissions (add/delete vectors) to the index.
	GrantWrite(grantee awsiam.IGrantable)
	// Returns a string representation of this construct.
	ToString() *string
}

// The jsii proxy struct for Index
type jsiiProxy_Index struct {
	internal.Type__constructsConstruct
}

func (j *jsiiProxy_Index) IndexArn() *string {
	var returns *string
	_jsii_.Get(
		j,
		"indexArn",
		&returns,
	)
	return returns
}

func (j *jsiiProxy_Index) IndexName() *string {
	var returns *string
	_jsii_.Get(
		j,
		"indexName",
		&returns,
	)
	return returns
}

func (j *jsiiProxy_Index) Node() constructs.Node {
	var returns constructs.Node
	_jsii_.Get(
		j,
		"node",
		&returns,
	)
	return returns
}


func NewIndex(scope constructs.Construct, id *string, props *IndexProps) Index {
	_init_.Initialize()

	if err := validateNewIndexParameters(scope, id, props); err != nil {
		panic(err)
	}
	j := jsiiProxy_Index{}

	_jsii_.Create(
		"cdk-s3-vectors.Index",
		[]interface{}{scope, id, props},
		&j,
	)

	return &j
}

func NewIndex_Override(i Index, scope constructs.Construct, id *string, props *IndexProps) {
	_init_.Initialize()

	_jsii_.Create(
		"cdk-s3-vectors.Index",
		[]interface{}{scope, id, props},
		i,
	)
}

// Checks if `x` is a construct.
//
// Returns: true if `x` is an object created from a class which extends `Construct`.
// Deprecated: use `x instanceof Construct` instead.
func Index_IsConstruct(x interface{}) *bool {
	_init_.Initialize()

	if err := validateIndex_IsConstructParameters(x); err != nil {
		panic(err)
	}
	var returns *bool

	_jsii_.StaticInvoke(
		"cdk-s3-vectors.Index",
		"isConstruct",
		[]interface{}{x},
		&returns,
	)

	return returns
}

func (i *jsiiProxy_Index) GrantWrite(grantee awsiam.IGrantable) {
	if err := i.validateGrantWriteParameters(grantee); err != nil {
		panic(err)
	}
	_jsii_.InvokeVoid(
		i,
		"grantWrite",
		[]interface{}{grantee},
	)
}

func (i *jsiiProxy_Index) ToString() *string {
	var returns *string

	_jsii_.Invoke(
		i,
		"toString",
		nil, // no parameters
		&returns,
	)

	return returns
}

