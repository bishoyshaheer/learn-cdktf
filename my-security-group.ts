import {Construct} from 'constructs';
import {SecurityGroup} from "@cdktf/provider-aws/lib/security-group";

export class MySecurityGroup extends Construct {
    public readonly sshSecurityGroup: SecurityGroup;

    constructor(scope: Construct, id: string, vpcId: string) {
        super(scope, id);
        // Create a security group within the VPC that allows SSH access
        this.sshSecurityGroup = new SecurityGroup(this, 'sshSecurityGroup', {
            name: 'ssh-access',
            description: 'Allow SSH access',
            vpcId: vpcId,
            ingress: [{
                fromPort: 22,
                toPort: 22,
                protocol: 'tcp',
                cidrBlocks: ['0.0.0.0/0'], // Replace with your IP address
            }],
            egress: [{
                fromPort: 0,
                toPort: 0,
                protocol: '-1',
                cidrBlocks: ['0.0.0.0/0'],
            }],
        });

    }
}
