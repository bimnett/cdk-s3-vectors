import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Bimnet',
  authorAddress: 'bimnett@gmail.com',
  authorEmail: 'bimnett@gmail.com',
  authorName: 'Bimnet Tesfamariam',
  cdkVersion: '2.205.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.8.0',
  name: 'cdk-s3-vectors',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/bimnett/cdk-s3-vectors.git',

  // Python
  publishToPypi: {
    distName: 'cdk-s3-vectors',
    module: 'cdk_s3_vectors',
  },

  // Java (Maven)
  publishToMaven: {
    javaPackage: 'com.bimnett.cdks3vectors',
    mavenGroupId: 'com.bimnett',
    mavenArtifactId: 'cdk-s3-vectors',
  },

  // C# (.NET / NuGet)
  publishToNuget: {
    dotNetNamespace: 'Bimnett.CdkS3Vectors',
    packageId: 'Bimnett.CdkS3Vectors',
  },

  // Go
  publishToGo: {
    moduleName: 'github.com/bimnett/cdk-s3-vectors',
  },

  bundledDeps: ['@aws-sdk/client-s3vectors'],

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

// Copy Lambda assets to lib directory after compilation
project.compileTask.exec('cp -r src/lambda lib/');
project.compileTask.exec('cd lib/lambda && npm install');

project.synth();