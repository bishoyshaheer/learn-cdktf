import {Construct} from 'constructs';
import {EksCluster} from "@cdktf/provider-aws/lib/eks-cluster";
import {EksNodeGroup} from "@cdktf/provider-aws/lib/eks-node-group";


export class MyEksCluster extends Construct {
    public readonly nodeGroup;

    constructor(scope: Construct, id: string, subnetIds: string[]) {
        super(scope, id);

        const cluster = new EksCluster(this, 'EksCluster', {
            name: `${id}-cluster`,
            roleArn: 'arn:aws:iam::123456789012:role/EksClusterRole', // Specify the ARN of your EKS cluster role
            version: '1.21',
            vpcConfig: {
                subnetIds: subnetIds, // Specify your subnet IDs
            },
        });

        this.nodeGroup = new EksNodeGroup(this, 'EksNodeGroup', {
            clusterName: cluster.name,
            nodeGroupName: `${id}-node-group`,
            nodeRoleArn: 'arn:aws:iam::123456789012:role/EksNodeGroupRole', // Specify the ARN of your EKS node group role
            subnetIds: cluster.vpcConfig.subnetIds,
            scalingConfig: {
                desiredSize: 2,
                maxSize: 3,
                minSize: 1,
            },
            // Specify other configurations like AMI type, instance types, etc.
        });

        // Optionally, output the cluster endpoint and other information
    }
}
