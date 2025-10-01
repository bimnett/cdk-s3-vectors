import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'bimnett',
  authorAddress: 'bimnett@gmail.com',
  authorEmail: 'bimnett@gmail.com',
  authorName: 'Bimnet Tesfamariam',
  cdkVersion: '2.205.0',
  defaultReleaseBranch: 'main',
  majorVersion: 0,
  jsiiVersion: '~5.8.0',
  name: 'cdk-s3-vectors',
  projenrcTs: true,
  github: false,
  repositoryUrl: 'https://github.com/bimnett/cdk-s3-vectors.git',

  description: 'A CDK construct library for Amazon S3 Vectors. This construct simplifies the creation of vector buckets, vector indexes with full configuration options, and Amazon Bedrock knowledge bases using S3 Vectors as the underlying vector store.',
  keywords: [
    'S3 Vectors',
    'Amazon S3',
    'Vector',
    'Vectors',
    'Knowledge Base',
  ],

  bundledDeps: [
    '@aws-sdk/client-s3vectors',
    '@aws-sdk/client-bedrock-agent',
    'uuid',
  ],

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

// Copy Lambda assets to lib directory after compilation
project.compileTask.exec('cp -r src/lambda lib/');
project.compileTask.exec('cd lib/lambda && npm install --production');

// Ensure Lambda dependencies are included in the npm package
project.npmignore?.addPatterns('!lib/lambda/node_modules/**');
project.addFields({ files: ['lib/**/*.js', 'lib/**/*.d.ts', 'lib/lambda/**/*', '!lib/**/*.map', '.jsii'] });

project.synth();