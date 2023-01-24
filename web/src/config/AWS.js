import AWS from "aws-sdk";

// AWS.config = new AWS.Config({
//     credentials: new AWS.CredentialProviderChain(),
//     region: 'ap-northeast-1',
//     endpoint: 'http://localhost:8000'
// });

AWS.config.update(
    {
        endpoint: 'http://localhost:8000',
        sslEnabled: false,
        region: 'dynamodb',
        accessKeyId: "dummy",
        secretAccessKey: "dummy"
    }
);

// AWS.config = new AWS.Config({
//     credentials: myCredentials,
//     region: 'ap-northeast-1',
//     endpoint: 'dynamodb-local:8000',
//     sslEnabled: false
// });
// const documentClient = new AWS.DynamoDB.DocumentClient();

export default AWS;