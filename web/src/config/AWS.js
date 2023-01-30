import AWS from "aws-sdk";

AWS.config.update(
    {
        endpoint: 'http://localhost:8000',
        sslEnabled: false,
        region: 'dynamodb',
        accessKeyId: "dummy",
        secretAccessKey: "dummy"
    }
);

export default AWS;