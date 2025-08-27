const {
  S3VectorsClient,
  CreateVectorBucketCommand,
  DeleteVectorBucketCommand,
  ListIndexesCommand,
  DeleteIndexCommand,
} = require('@aws-sdk/client-s3vectors');

exports.handler = async (event, context) => {

  const physicalResourceId = event.PhysicalResourceId || event.ResourceProperties.vectorBucketName;
  const region = context.invokedFunctionArn.split(':')[3];
  const accountId = context.invokedFunctionArn.split(':')[4];
  const client = new S3VectorsClient({ region: region });
  
  
  if(event.RequestType === 'Create') {
    const vectorBucketName = event.ResourceProperties.vectorBucketName;
    if(!vectorBucketName) {
      throw new Error('vectorBucketName is required');
    }

    const createParams = {
      vectorBucketName: vectorBucketName,
    };
    if(event.ResourceProperties.encryptionConfiguration) {
      createParams.encryptionConfiguration = event.ResourceProperties.encryptionConfiguration;
    }

    try {
      const command = new CreateVectorBucketCommand(createParams);
      await client.send(command);
      const vectorBucketArn = `arn:aws:s3vectors:${region}:${accountId}:bucket/${vectorBucketName}`;
      
      return {
        PhysicalResourceId: vectorBucketName,
        Data: {
          VectorBucketName: vectorBucketName,
          VectorBucketArn: vectorBucketArn,
        },
      };
    } catch(error){
      console.error('Error creating vector bucket:', error);
      throw error;
    }
  }
  else if(event.RequestType === 'Delete') {
    const vectorBucketName = physicalResourceId;
    const vectorBucketArn = `arn:aws:s3vectors:${region}:${accountId}:bucket/${vectorBucketName}`;

    // Delete all indexes in the bucket first
    const listParams = {
      vectorBucketArn: vectorBucketArn
    };

    try {
      const listIndexesCommand = new ListIndexesCommand(listParams);
      const listResponse = await client.send(listIndexesCommand);
      for (const index of listResponse.indexes) {
        const deleteIndexCommand = new DeleteIndexCommand({ indexArn: index.indexArn });
        await client.send(deleteIndexCommand);
      }
    } catch(error) {
      if(error.name !== 'NotFoundException' && error.name !== 'ResourceNotFoundException') {
        console.error('Error listing indexes in vector bucket:', error);
        throw error;
      }
    }

    // Then delete the bucket
    const deleteParams = {
      vectorBucketArn: vectorBucketArn
    };

    try {
      const deleteBucketCommand = new DeleteVectorBucketCommand(deleteParams);
      await client.send(deleteBucketCommand);
      return { PhysicalResourceId: physicalResourceId };
    } catch(error) {
      console.error('Error deleting bucket:', error);
      throw error;
    }
  }
  else if(event.RequestType === 'Update') {
    // The S3 Vectors API does not currently support updates.
    const vectorBucketName = physicalResourceId;
    const vectorBucketArn = `arn:aws:s3vectors:${region}:${accountId}:bucket/${vectorBucketName}`;
    return {
      PhysicalResourceId: vectorBucketName,
      Data: {
        VectorBucketName: vectorBucketName,
        VectorBucketArn: vectorBucketArn,
      },
    };
  }
};