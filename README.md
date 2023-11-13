# Dynamodb_Project
Load data from s3 to dynamo db

Steps to Load the data
- Please install serverless package golbally by running "npm install serverless -g" command
- Configure the AWS account using cmd 
    - using command "aws configure"
    - provide access key and sceret access key
    - provide default region and output format
- Create a dynamodb table with the attributes required
- Run npm install for install the required libraries.
- In terminal, run command "serverless deploy", this will create the couldoformation template and get deployed on the configured aws account.
- Once the s3 bucket is create add the below bucket access policy to the s3 bucket, so that the lambda can access the files from s3.

s3 bucket policy
{
    "Id": "Policy1699469235147",
    "Version": "2012-10-17",
    "Statement": [
    {
        "Sid": "Stmt1699468300513",
        "Action": "s3:*",
        "Effect": "Allow",
        "Resource": "arn:aws:s3:::psstdynamodbbuckettest", // provide the arn of s3 bucket.
        "Principal": {
        "AWS": [
            "arn:aws:iam::774104967360:role/source-dev-us-east-1-lambdaRole" //provide the arn of lambda role here 
        ]
        }
    }
    ]
}

-with these steps, we are all set to upload the file to s3 and it will trigger the lambda to push data to dynamo db.