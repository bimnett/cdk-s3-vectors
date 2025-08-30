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
  repositoryUrl: 'https://github.com/bimnett/cdk-s3-vectors.git',

  // Python
  publishToPypi: {
    distName: 'cdk-s3-vectors',
    module: 'cdk_s3_vectors',
  },

  // C# (.NET / NuGet)
  publishToNuget: {
    dotNetNamespace: 'bimnett.CdkS3Vectors',
    packageId: 'bimnett.CdkS3Vectors',
  },

  // Java (Maven)
  publishToMaven: {
    javaPackage: 'io.github.bimnett.cdks3vectors',
    mavenGroupId: 'io.github.bimnett',
    mavenArtifactId: 'cdk-s3-vectors',
  },

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