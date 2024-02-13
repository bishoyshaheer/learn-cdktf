import {Construct} from 'constructs';
import {Vpc} from "@cdktf/provider-aws/lib/vpc";
import {Subnet} from "@cdktf/provider-aws/lib/subnet";
import {InternetGateway} from "@cdktf/provider-aws/lib/internet-gateway";
import {RouteTable} from "@cdktf/provider-aws/lib/route-table";
import {Route} from "@cdktf/provider-aws/lib/route";
import {RouteTableAssociation} from "@cdktf/provider-aws/lib/route-table-association";

export class MyVpc extends Construct {
    public readonly vpc: Vpc;
    public readonly subnet: Subnet;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // Create a new VPC
        this.vpc = new Vpc(this, 'MyVPC', {
            cidrBlock: '10.0.0.0/16',
        });

        // Create an Internet Gateway and attach it to the VPC
        const internetGateway = new InternetGateway(this, 'MyInternetGateway', {
            vpcId: this.vpc.id,
        });

        // Create a public subnet within the VPC
        this.subnet = new Subnet(this, 'MySubnet', {
            vpcId: this.vpc.id,
            cidrBlock: '10.0.1.0/24',
            mapPublicIpOnLaunch: true,
            availabilityZone: 'eu-west-1a',
        });

        // Create a new Route Table for the VPC
        const routeTable = new RouteTable(this, 'MyRouteTable', {
            vpcId: this.vpc.id,
        });

        // Create a route in the Route Table that directs internet-bound traffic to the Internet Gateway
        new Route(this, 'InternetAccessRoute', {
            routeTableId: routeTable.id,
            destinationCidrBlock: '0.0.0.0/0',
            gatewayId: internetGateway.id,
        });

        // Associate the Route Table with the subnet
        new RouteTableAssociation(this, 'SubnetRouteTableAssociation', {
            subnetId: this.subnet.id,
            routeTableId: routeTable.id,
        });
    }
}
