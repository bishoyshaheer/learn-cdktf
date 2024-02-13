import {Construct} from 'constructs';
import {IamRole} from "@cdktf/provider-aws/lib/iam-role";
import {IamPolicyAttachment} from "@cdktf/provider-aws/lib/iam-policy-attachment";
import {CodebuildProject} from "@cdktf/provider-aws/lib/codebuild-project";
import {Codepipeline} from "@cdktf/provider-aws/lib/codepipeline";

export class MyCodepipeline extends Construct {
    public readonly pipeline;

    constructor(scope: Construct, id: string, yourEcrRepositoryUri: string, s3BucketForArtifacts: string, yourGithubOauthToken: string) {
        super(scope, id);
        const codeBuildRole = new IamRole(this, 'CodeBuildRole', {
            assumeRolePolicy: JSON.stringify({
                Version: '2012-10-17',
                Statement: [{
                    Action: 'sts:AssumeRole',
                    Principal: {Service: 'codebuild.amazonaws.com'},
                    Effect: 'Allow',
                }],
            }),
        });

        new IamPolicyAttachment(this, 'CodeBuildPolicyAttachment', {
            name: 'CodeBuildAccessECR',
            roles: [codeBuildRole.name],
            policyArn: 'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser',
        });
        const codeBuildProject = new CodebuildProject(this, 'MyCodeBuildProject', {
            artifacts: {
                type: 'CODEPIPELINE'
            },
            name: 'MyDockerBuild',
            serviceRole: codeBuildRole.arn,
            // Specify source as GitHub and include buildspec configuration
            source: {
                type: 'GITHUB',
                location: 'https://github.com/jatins/express-hello-world.git',
            },
            environment: {
                computeType: 'BUILD_GENERAL1_SMALL',
                image: 'aws/codebuild/standard:4.0',
                type: 'LINUX_CONTAINER',
                environmentVariable: [{
                    name: 'ECR_REPOSITORY_URI',
                    value: yourEcrRepositoryUri, // Use your actual ECR repository URI
                }],
                privilegedMode: true, // Necessary for Docker builds
            }
            // Define artifacts and other configurations as needed
        });


        this.pipeline = new Codepipeline(this, 'MyCodePipeline', {
            name: 'MyApplicationPipeline',
            roleArn: 'arn:aws:iam::123456789012:role/service-role/AWSCodePipelineServiceRole', // Use the ARN of a suitable IAM role
            artifactStore: [{
                location: s3BucketForArtifacts, // Specify your S3 bucket for storing pipeline artifacts
                type: 'S3',
            }],
            stage: [
                {
                    name: 'Source',
                    action: [{
                        name: 'GitHub_Source',
                        category: 'Source',
                        owner: 'ThirdParty',
                        provider: 'GitHub',
                        version: '1',
                        outputArtifacts: ['sourceOutput'],
                        configuration: {
                            Owner: 'jatins',
                            Repo: 'express-hello-world',
                            Branch: 'main',
                            OAuthToken: yourGithubOauthToken, // Securely store and reference your GitHub OAuth token
                        },
                    }],
                },
                {
                    name: 'Build',
                    action: [{
                        name: 'Build_and_Push_Docker_Image',
                        category: 'Build',
                        owner: 'AWS',
                        provider: 'CodeBuild',
                        inputArtifacts: ['sourceOutput'],
                        outputArtifacts: ['buildOutput'],
                        version: '1',
                        configuration: {
                            ProjectName: codeBuildProject.name,
                        },
                    }],
                },
            ],
        });
    }

// Add a buildspec.yml File
// Your GitHub repository should include a buildspec.yml file that defines how to build the Docker image and push it to ECR. Here’s an example buildspec.yml:
//
// yaml
// Copy code
// version: 0.2
//
// phases:
//     pre_build:
//         commands:
//             - echo Logging in to Amazon ECR...
// - aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI
// build:
//     commands:
//         - echo Build started on `date`
// - echo Building the Docker image...
// - docker build -t $ECR_REPOSITORY_URI:latest .
//     post_build:
// commands:
//     - echo Build completed on `date`
// - echo Pushing the Docker image...
// - docker push $ECR_REPOSITORY_URI:latest
}
