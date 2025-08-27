const { 
  S3VectorsClient, 
  CreateIndexCommand, 
  DeleteIndexCommand,
} = require('@aws-sdk/client-s3vectors');

exports.handler = async (event, context) => {
  
  const region = context.invokedFunctionArn.split(':')[3];
  const accountId = context.invokedFunctionArn.split(':')[4];
  const client = new S3VectorsClient({ region: region });

  const vectorBucketName = event.ResourceProperties.vectorBucketName;
  const indexName = event.ResourceProperties.indexName;
  const indexArn = `arn:aws:s3vectors:${region}:${accountId}:bucket/${vectorBucketName}/index/${indexName}`;
  const physicalResourceId = `${vectorBucketName}-${indexName}`;
  if (!vectorBucketName || !indexName) {
    throw new Error('vectorBucketName and indexName are required');
  }


  if(event.RequestType === 'Create') {
    const createParams = {
      vectorBucketName: vectorBucketName,
      indexName: indexName,
      dataType: event.ResourceProperties.dataType,
      dimension: parseInt(event.ResourceProperties.dimension),
      distanceMetric: event.ResourceProperties.distanceMetric,
    };
    if(event.ResourceProperties.metadataConfiguration) {
      createParams.metadataConfiguration = event.ResourceProperties.metadataConfiguration;
    }

    try {
      const command = new CreateIndexCommand(createParams);
      await client.send(command);
      
      return {
        PhysicalResourceId: physicalResourceId,
        Data: {
          IndexArn: indexArn, 
          IndexName: indexName
        },
      };
    } catch (error) {
      console.error('Error creating index:', error);
      throw error;
    }
  }
  else if(event.RequestType === 'Delete') {
    const deleteParams = {
      indexArn: indexArn
    };

    try {
      const command = new DeleteIndexCommand(deleteParams);
      await client.send(command);

      return { PhysicalResourceId: physicalResourceId };
    } catch (error) {
      console.error('Error deleting index:', error);
      throw error;
    }
  }
  else if(event.RequestType === 'Update') {
    // The S3 Vectors API does not currently support updates.
    return {
      PhysicalResourceId: physicalResourceId,
      Data: {
        IndexArn: indexArn, 
        IndexName: indexName
      },
    };
  }
}