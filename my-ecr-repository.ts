// MyEcrRepository.ts
import {Construct} from 'constructs';
import {EcrRepository} from "@cdktf/provider-aws/lib/ecr-repository";

export class MyEcrRepository extends Construct {
    public readonly repository: EcrRepository;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.repository = new EcrRepository(this, 'ECRRepository', {
            name: `my-ecr-repo-${id}`, // Ensure the repository name is unique
            // You can add more configuration here as needed, such as imageScanningConfiguration or lifecyclePolicy, etc.
        });
    }
}
