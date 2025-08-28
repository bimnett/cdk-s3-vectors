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
// Creates a vector bucket in the specified AWS Region.
type Bucket interface {
	constructs.Construct
	// The tree node.
	Node() constructs.Node
	// The ARN (Amazon Resource Name) of the created S3 vector bucket.
	VectorBucketArn() *string
	// The name of the vector bucket to create.
	VectorBucketName() *string
	// Grants permissions to list indexes within this vector bucket.
	GrantListIndexes(grantee awsiam.IGrantable)
	// Returns a string representation of this construct.
	ToString() *string
}

// The jsii proxy struct for Bucket
type jsiiProxy_Bucket struct {
	internal.Type__constructsConstruct
}

func (j *jsiiProxy_Bucket) Node() constructs.Node {
	var returns constructs.Node
	_jsii_.Get(
		j,
		"node",
		&returns,
	)
	return returns
}

func (j *jsiiProxy_Bucket) VectorBucketArn() *string {
	var returns *string
	_jsii_.Get(
		j,
		"vectorBucketArn",
		&returns,
	)
	return returns
}

func (j *jsiiProxy_Bucket) VectorBucketName() *string {
	var returns *string
	_jsii_.Get(
		j,
		"vectorBucketName",
		&returns,
	)
	return returns
}


func NewBucket(scope constructs.Construct, id *string, props *BucketProps) Bucket {
	_init_.Initialize()

	if err := validateNewBucketParameters(scope, id, props); err != nil {
		panic(err)
	}
	j := jsiiProxy_Bucket{}

	_jsii_.Create(
		"cdk-s3-vectors.Bucket",
		[]interface{}{scope, id, props},
		&j,
	)

	return &j
}

func NewBucket_Override(b Bucket, scope constructs.Construct, id *string, props *BucketProps) {
	_init_.Initialize()

	_jsii_.Create(
		"cdk-s3-vectors.Bucket",
		[]interface{}{scope, id, props},
		b,
	)
}

// Checks if `x` is a construct.
//
// Returns: true if `x` is an object created from a class which extends `Construct`.
// Deprecated: use `x instanceof Construct` instead.
func Bucket_IsConstruct(x interface{}) *bool {
	_init_.Initialize()

	if err := validateBucket_IsConstructParameters(x); err != nil {
		panic(err)
	}
	var returns *bool

	_jsii_.StaticInvoke(
		"cdk-s3-vectors.Bucket",
		"isConstruct",
		[]interface{}{x},
		&returns,
	)

	return returns
}

func (b *jsiiProxy_Bucket) GrantListIndexes(grantee awsiam.IGrantable) {
	if err := b.validateGrantListIndexesParameters(grantee); err != nil {
		panic(err)
	}
	_jsii_.InvokeVoid(
		b,
		"grantListIndexes",
		[]interface{}{grantee},
	)
}

func (b *jsiiProxy_Bucket) ToString() *string {
	var returns *string

	_jsii_.Invoke(
		b,
		"toString",
		nil, // no parameters
		&returns,
	)

	return returns
}

