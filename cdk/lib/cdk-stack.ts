import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

const staticBuildFilesPath = './../dist';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostingBucket = new Bucket(this, 'MadeForAllClientBucket', {
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const certificateArn = process.env.AWS_CERTIFICATE_ARN;

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'MadeForAllCertificate',
      certificateArn,
    );

    const distribution = new Distribution(
      this,
      'MadeForAllCloudFrontDistribution',
      {
        defaultBehavior: {
          origin: new S3Origin(hostingBucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: 'index.html',
        domainNames: [
          `${process.env.VITE_APP_BASE_URL}`,
          `www.${process.env.VITE_APP_BASE_URL}`,
        ],
        certificate,
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          },
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          },
        ],
      },
    );

    new BucketDeployment(this, 'BucketDeployment', {
      sources: [Source.asset(staticBuildFilesPath)],
      destinationBucket: hostingBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: distribution.domainName,
      description: 'The distribution URL',
      exportName: 'CloudfrontURL',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: hostingBucket.bucketName,
      description: 'The name of the S3 bucket',
      exportName: 'BucketName',
    });
  }
}
