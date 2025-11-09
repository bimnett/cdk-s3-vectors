from aws_cdk import (
    Stack,
    aws_kms as kms,
    aws_s3 as s3,
    aws_bedrock as bedrock,
)
from constructs import Construct
import cdk_s3_vectors as s3_vectors

class S3VectorsStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create S3 bucket for storing documents
        document_bucket = s3.Bucket(
            self, "DocumentBucket", # Renamed ID to PascalCase for convention
            enforce_ssl=True,
            versioned=False
        )

        # Create S3 bucket for storing supplemental data
        supplemental_data_bucket = s3.Bucket(
            self, "SupplementalDataBucket", # Renamed ID to PascalCase for convention
            enforce_ssl=True,
            versioned=False
        )

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
                "sseType": "aws:kms",  # 'AES256' | 'aws:kms'
                "kmsKey": encryption_key  # Required when sseType is 'aws:kms'
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
                "nonFilterableMetadataKeys": ["source", "timestamp", "category"]
            }
        )
        # REQUIRED - add dependency for vector index
        vector_index.node.add_dependency(vector_bucket)

        # Create a knowledge base with all options
        knowledge_base = s3_vectors.KnowledgeBase(
            self, "KnowledgeBase",
            knowledge_base_name="my-knowledge-base",  # REQUIRED
            vector_bucket_arn=vector_bucket.vector_bucket_arn,  # REQUIRED
            index_arn=vector_index.index_arn,  # REQUIRED
            # REQUIRED knowledge base configuration
            knowledge_base_configuration={
                "embeddingModelArn": "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0",  # REQUIRED
                "embeddingDataType": "FLOAT32",  # Optional: 'BINARY' | 'FLOAT32'
                "dimensions": "1024",  # Optional: dimensions as string
                # Supplemental Data Configuration
                "supplementalDataStorageConfiguration": {
                    "s3Location": f"s3://{supplemental_data_bucket.bucket_name}"
                },
            },
            # Optional fields
            description="Knowledge base for vector similarity search using S3 Vectors",
            client_token="unique-client-token-12345678901234567890123456789012345"  # Must be >= 33 characters
        )
        # REQUIRED - add dependencies for knowledge base
        knowledge_base.node.add_dependency(vector_index)
        knowledge_base.node.add_dependency(vector_bucket)
        # Add dependency for supplemental data bucket
        knowledge_base.node.add_dependency(supplemental_data_bucket)

        # Create data source for knowledge base
        data_source = bedrock.CfnDataSource(
            self, "DataSource", # Renamed ID to PascalCase for convention
            name="my-data-source",
            knowledge_base_id=knowledge_base.knowledge_base_id,
            data_source_configuration={
                "type": "S3",
                "s3Configuration": {
                    "bucketArn": document_bucket.bucket_arn,
                }
            }
        )

        # Add dependencies for data source
        data_source.node.add_dependency(knowledge_base)
        data_source.node.add_dependency(document_bucket)


        # Allow knowledge base to read from document bucket
        document_bucket.grant_read(knowledge_base.role)
        # Grant ReadWrite permission to supplemental data bucket
        supplemental_data_bucket.grant_read_write(knowledge_base.role)