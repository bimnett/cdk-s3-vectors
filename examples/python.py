from aws_cdk import (
    Stack,
    aws_kms as kms,
)
from constructs import Construct
import cdk_s3_vectors as s3_vectors

class S3VectorsStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create KMS key for encryption (optional)
        encryption_key = kms.Key(
            self, "VectorBucketKey",
            description="KMS key for S3 vector bucket encryption",
            enable_key_rotation=True
        )

        # Create a vector bucket with all options
        vector_bucket = s3_vectors.Bucket(
            self, "VectorBucket",
            vector_bucket_name="my-vector-bucket",  # REQUIRED
            encryption_configuration={
                "sse_type": "aws:kms",  # 'AES256' | 'aws:kms'
                "kms_key": encryption_key  # Required when sse_type is 'aws:kms'
            }
        )

        # Create a vector index with all options
        vector_index = s3_vectors.Index(
            self, "VectorIndex",
            vector_bucket_name=vector_bucket.vector_bucket_name,  # REQUIRED
            index_name="my-index",  # REQUIRED
            data_type="float32",  # REQUIRED (only 'float32' supported)
            dimension=1024,  # REQUIRED (1-4096)
            distance_metric="cosine",  # REQUIRED ('euclidean' | 'cosine')
            metadata_configuration={
                "non_filterable_metadata_keys": ["source", "timestamp", "category"]
            }
        )
        vector_index.node.add_dependency(vector_bucket)

        # Create a knowledge base with all options
        knowledge_base = s3_vectors.KnowledgeBase(
            self, "KnowledgeBase",
            knowledge_base_name="my-knowledge-base",  # REQUIRED
            vector_bucket_arn=vector_bucket.vector_bucket_arn,  # REQUIRED
            index_arn=vector_index.index_arn,  # REQUIRED
            knowledge_base_configuration={
                "embedding_model_arn": "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0",  # REQUIRED
                "embedding_data_type": "FLOAT32",  # Optional: 'BINARY' | 'FLOAT32'
                "dimensions": "1024"  # Optional: dimensions as string
            },
            description="Knowledge base for vector similarity search using S3 Vectors",
            client_token="unique-client-token-12345678901234567890123456789012345"  # Must be >= 33 characters
        )
        knowledge_base.node.add_dependency(vector_index)
        knowledge_base.node.add_dependency(vector_bucket)