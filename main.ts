import {Construct} from "constructs";
import {App, TerraformOutput, TerraformStack} from "cdktf";
import {AwsProvider} from "@cdktf/provider-aws/lib/provider";
import {Instance} from "@cdktf/provider-aws/lib/instance";
import {KeyPair} from "@cdktf/provider-aws/lib/key-pair";
import {MyVpc} from "./my-vpc";
import * as fs from "fs";
import {MySecurityGroup} from "./my-security-group";


class MyStack extends TerraformStack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        new AwsProvider(this, "AWS", {
            region: "eu-west-1",
        });

        const myVpc = new MyVpc(this, 'MyVpcStack');

        const mySecurityGroup = new MySecurityGroup(this, 'MySecurityGroup', myVpc.vpc.id)

        const publicKeyPath = './mykey.pub'; // Specify the path to your public key file
        const publicKey = fs.readFileSync(publicKeyPath, 'utf8'); // Read the content of the public key file

        // Create an EC2 key pair
        const keyPair = new KeyPair(this, 'mykeypair', {
            keyName: 'mykeypair', // Specify your desired key name
            publicKey: publicKey, // Replace with your SSH public key
        });

        // EC2 instance with the key pair, security group, and in the subnet
        const ec2Instance = new Instance(this, "compute", {
            ami: "ami-0f29c8402f8cce65c",
            instanceType: "t2.micro",
            keyName: keyPair.keyName, // Use your key pair name
            vpcSecurityGroupIds: [mySecurityGroup.sshSecurityGroup.id],
            subnetId: myVpc.subnet.id, // Place the instance in the public subnet
        });

        new TerraformOutput(this, "public_ip", {
            value: ec2Instance.publicIp,
        });
        // Output the public DNS of the instance
        new TerraformOutput(this, "public_dns", {
            value: ec2Instance.publicDns,
        });
    }

}

const app = new App();
new MyStack(app, "learn-cdktf");
app.synth();
