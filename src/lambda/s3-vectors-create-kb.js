const { 
  BedrockAgentClient,
  CreateKnowledgeBaseCommand,
  DeleteKnowledgeBaseCommand,
  GetKnowledgeBaseCommand,
  UpdateKnowledgeBaseCommand 
} = require('@aws-sdk/client-bedrock-agent');

exports.handler = async (event, context) => {

  const region = context.invokedFunctionArn.split(':')[3];
  const accountId = context.invokedFunctionArn.split(':')[4];
  const client = new BedrockAgentClient({ region: region });

  if(event.RequestType === 'Create') {    
    const createParams = {
      name: event.ResourceProperties.knowledgeBaseName,
      roleArn: event.ResourceProperties.roleArn,
      knowledgeBaseConfiguration: {
        type: 'VECTOR',
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn: event.ResourceProperties.knowledgeBaseConfiguration.embeddingModelArn,
          embeddingModelConfiguration: {
            bedrockEmbeddingModelConfiguration: {
              dimensions: parseInt(event.ResourceProperties.knowledgeBaseConfiguration.dimensions),
              embeddingDataType: event.ResourceProperties.knowledgeBaseConfiguration.embeddingDataType,
            },
          },
        },
      },
      storageConfiguration: {
        type: 'S3_VECTORS',
        s3VectorsConfiguration: {
          vectorBucketArn: event.ResourceProperties.vectorBucketArn,
          indexArn: event.ResourceProperties.indexArn,
        },
      },
    };
    if (event.ResourceProperties.description) {
      createParams.description = event.ResourceProperties.description;
    }
    if (event.ResourceProperties.clientToken) {
      createParams.clientToken = event.ResourceProperties.clientToken;
    }
    if (event.ResourceProperties.knowledgeBaseConfiguration.supplementalDataStorageConfiguration) {
        createParams.knowledgeBaseConfiguration.vectorKnowledgeBaseConfiguration.supplementalDataStorageConfiguration = {
            storageLocations: [
              { 
                type: 'S3', 
                s3Location: {
                  uri: event.ResourceProperties.knowledgeBaseConfiguration.supplementalDataStorageConfiguration.s3Location,
                },
              }
            ]
          }
    }
    try {
      const command = new CreateKnowledgeBaseCommand(createParams);
      const createResponse = await client.send(command);

      const knowledgeBaseId = createResponse.knowledgeBase.knowledgeBaseId;
      await waitForKnowledgeBaseCreation(client, knowledgeBaseId, 'ACTIVE');
      return {
        PhysicalResourceId: knowledgeBaseId,
        Data: {
          KnowledgeBaseId: knowledgeBaseId,
          KnowledgeBaseArn: createResponse.knowledgeBase.knowledgeBaseArn,
        },
      };
    } catch(error) {
      console.error('Error creating knowledge base:', error);
      throw error;
    }
  }
  else if (event.RequestType === 'Delete') {
    const knowledgeBaseId = event.PhysicalResourceId;

    try {
      const deleteCommand = new DeleteKnowledgeBaseCommand({ knowledgeBaseId });
      await client.send(deleteCommand);
      await waitForKnowledgeBaseDeletion(client, knowledgeBaseId);
      return { PhysicalResourceId: knowledgeBaseId };
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        // If the resource is not found, treat as success
        return { PhysicalResourceId: knowledgeBaseId };
      }
      console.error('Error deleting knowledge base:', error);
      throw error;
    }
  }
  else if(event.RequestType === 'Update') {
    const knowledgeBaseId = event.PhysicalResourceId;
    const mergedProps = deepMerge(event.OldResourceProperties, event.ResourceProperties);
    
    const updateParams = {
      knowledgeBaseId: knowledgeBaseId,
      name: mergedProps.knowledgeBaseName,
      roleArn: mergedProps.roleArn,
      description: mergedProps.description,
      knowledgeBaseConfiguration: {
        type: 'VECTOR',
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn: mergedProps.knowledgeBaseConfiguration.embeddingModelArn,
          embeddingModelConfiguration: {
            bedrockEmbeddingModelConfiguration: {
              dimensions: parseInt(mergedProps.knowledgeBaseConfiguration.dimensions),
              embeddingDataType: mergedProps.knowledgeBaseConfiguration.embeddingDataType,
            },
          },
        },
      },
      storageConfiguration: {
        type: 'S3_VECTORS',
        s3VectorsConfiguration: {
          vectorBucketArn: mergedProps.vectorBucketArn,
          indexArn: mergedProps.indexArn,
        },
      },
    };

    try {
      const command = new UpdateKnowledgeBaseCommand(updateParams);
      await client.send(command);
      await waitForKnowledgeBaseCreation(client, knowledgeBaseId, 'ACTIVE');
      
      const predictedKnowledgeBaseId = `arn:aws:bedrock:${region}:${accountId}:knowledge-base/${knowledgeBaseId}`;
      return { 
        PhysicalResourceId: knowledgeBaseId,
        Data: {
          KnowledgeBaseId: knowledgeBaseId,
          KnowledgeBaseArn: predictedKnowledgeBaseId
        },
      };
    } catch (error) {
      console.error('Error updating knowledge base:', error);
      throw error;
    }
  }
};

async function waitForKnowledgeBaseCreation(client, knowledgeBaseId, status, maxAttempts = 30, delay = 10000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const getCommand = new GetKnowledgeBaseCommand({ knowledgeBaseId });
      const getResponse = await client.send(getCommand);
      const currentStatus = getResponse.knowledgeBase.status;
      if (currentStatus === status) {
        return;
      }
      console.log(`Knowledge Base ${knowledgeBaseId} status is ${currentStatus}, waiting...`);
    } catch (err) {
      if (err.name === 'ResourceNotFoundException' && status !== 'DELETING') {
         throw err;
      }
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error(`Timed out waiting for Knowledge Base ${knowledgeBaseId} to reach status ${status}`);
}

async function waitForKnowledgeBaseDeletion(client, knowledgeBaseId, maxAttempts = 30, delay = 10000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await client.send(new GetKnowledgeBaseCommand({ knowledgeBaseId }));
    } catch (err) {
      if (err.name === 'ResourceNotFoundException') {
        return;
      }
      throw err;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error(`Timed out waiting for Knowledge Base ${knowledgeBaseId} to be deleted`);
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}