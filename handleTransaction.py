import json
import boto3

def lambda_handler(event, context):
    
    # Initialize AWS SDK clients
    sagemaker_runtime = boto3.client('sagemaker-runtime')
    ses_client = boto3.client('ses')

    # Extract data from the event (assumed to be JSON format)
    input_data = json.loads(event['body'])

    # Serialize the input data for SageMaker (example assumes CSV input)
    serialized_input_data = ','.join(str(v) for v in input_data.values())

    # Invoke SageMaker endpoint
    response = sagemaker_runtime.invoke_endpoint(
        EndpointName='your-sagemaker-endpoint-name',
        ContentType='text/csv',
        Body=serialized_input_data
    )

    # Deserialize the response from SageMaker
    result = json.loads(response['Body'].read().decode())

    # Assuming the SageMaker model returns a 'fraud' key with a boolean value
    is_fraudulent = result.get('fraud', False)

    # If fraudulent, send alerts using SES
    if is_fraudulent:
        account_email = input_data['account_email']
        admin_email = 'HackToTheFuture@oldmutual.com'

        # Email content
        subject = "Fraud Alert: Suspicious Activity Detected"
        accountbody = (
            f"Dear User,\n\n"
            f"We have detected suspicious activity on your account.\n\n"
            f"Details:\n{json.dumps(input_data, indent=4)}\n\n"
            f"Please contact us immediately if this was not you.\n\n"
            f"Best regards,\nSecurity Team"
        )

        # Send email to the account owner
        ses_client.send_email(
            Source='security@oldmutual.com',
            Destination={'ToAddresses': [account_email]},
            Message={
                'Subject': {'Data': subject},
                'Body': {'Text': {'Data': accountbody}}
            }
        )
        
        adminbody = (
            f"Dear Admin,\n\n"
            f"We have detected suspicious activity on on of the user accounts.\n\n"
            f"Details:\n{json.dumps(input_data, indent=4)}\n\n"
            f"Best regards,\nSecurity Team"
        )

        # Send email to the admin user
        ses_client.send_email(
            Source='security@oldmutual.com',
            Destination={'ToAddresses': [admin_email]},
            Message={
                'Subject': {'Data': subject},
                'Body': {'Text': {'Data': adminbody}}
            }
        )

    # Return the response
    return {
        'statusCode': 200,
        'body': json.dumps({'fraud': is_fraudulent})
    }
