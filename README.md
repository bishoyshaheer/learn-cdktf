# cdk for terraform Hello World

## Description

This project demonstrates setting up and deploying AWS infrastructure using the Cloud Development Kit for Terraform (CDKTF). It includes steps to configure an AWS account, install necessary tools, and deploy resources such as an ECR repository and an EKS cluster.

## Prerequisites

Before you begin, ensure you have the following:

- An AWS account - [Sign up here](https://aws.amazon.com/)
- AWS CLI installed and configured - [Installation guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- Node.js installed - [Download here](https://nodejs.org/)
- CDK for Terraform (CDKTF) installed

## Setup Instructions

### 1. Configure Your AWS Account

Create or log into your AWS account and ensure you have administrative access.

### 2. Install AWS CLI

Follow the instructions to install the AWS CLI and configure it with your AWS account credentials:

```sh
aws configure
```
### 3. Install CDKTF

Install the CDKTF CLI globally using npm:

```sh
npm install -g cdktf-cli
```

### 4. Generate SSH Key Pair

Generate an SSH key pair for secure access to your resources. Replace `mykey` with your preferred filename:

```sh
ssh-keygen -f ~/path-to-main-ts/mykey
```

### 5. Run CDKTF Apply

Navigate to your CDKTF project directory and deploy your infrastructure:

```sh
cdktf deploy
```

### 6. clean up

To avoid incurring unnecessary charges, destroy the deployed resources:

```sh
cdktf destroy
```
