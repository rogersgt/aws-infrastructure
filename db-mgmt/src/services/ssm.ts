import { SSMClient, PutParameterCommand } from '@aws-sdk/client-ssm';

const ssmClient = new SSMClient();

export async function upsertParameter(name: string, value: string, secure = true) {
  const cmd = new PutParameterCommand({
    Name: name,
    Value: value,
    Type: secure ? 'SecureString' : 'String',
    Overwrite: true,
  });
  return ssmClient.send(cmd);
}
