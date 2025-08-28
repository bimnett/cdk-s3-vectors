// cdk-s3-vectors
package cdks3vectors

import (
	"reflect"

	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
)

func init() {
	_jsii_.RegisterClass(
		"cdk-s3-vectors.Bucket",
		reflect.TypeOf((*Bucket)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "grantListIndexes", GoMethod: "GrantListIndexes"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
			_jsii_.MemberProperty{JsiiProperty: "vectorBucketArn", GoGetter: "VectorBucketArn"},
			_jsii_.MemberProperty{JsiiProperty: "vectorBucketName", GoGetter: "VectorBucketName"},
		},
		func() interface{} {
			j := jsiiProxy_Bucket{}
			_jsii_.InitJsiiProxy(&j.Type__constructsConstruct)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-s3-vectors.BucketProps",
		reflect.TypeOf((*BucketProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-s3-vectors.EncryptionConfiguration",
		reflect.TypeOf((*EncryptionConfiguration)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-s3-vectors.Index",
		reflect.TypeOf((*Index)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "grantWrite", GoMethod: "GrantWrite"},
			_jsii_.MemberProperty{JsiiProperty: "indexArn", GoGetter: "IndexArn"},
			_jsii_.MemberProperty{JsiiProperty: "indexName", GoGetter: "IndexName"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
		},
		func() interface{} {
			j := jsiiProxy_Index{}
			_jsii_.InitJsiiProxy(&j.Type__constructsConstruct)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-s3-vectors.IndexProps",
		reflect.TypeOf((*IndexProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-s3-vectors.KnowledgeBase",
		reflect.TypeOf((*KnowledgeBase)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "grantIngestion", GoMethod: "GrantIngestion"},
			_jsii_.MemberProperty{JsiiProperty: "knowledgeBaseArn", GoGetter: "KnowledgeBaseArn"},
			_jsii_.MemberProperty{JsiiProperty: "knowledgeBaseId", GoGetter: "KnowledgeBaseId"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
		},
		func() interface{} {
			j := jsiiProxy_KnowledgeBase{}
			_jsii_.InitJsiiProxy(&j.Type__constructsConstruct)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-s3-vectors.KnowledgeBaseConfiguration",
		reflect.TypeOf((*KnowledgeBaseConfiguration)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-s3-vectors.KnowledgeBaseProps",
		reflect.TypeOf((*KnowledgeBaseProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-s3-vectors.MetadataConfiguration",
		reflect.TypeOf((*MetadataConfiguration)(nil)).Elem(),
	)
}
