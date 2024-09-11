import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Env } from '@interfaces';

export const getR2Client = (env: Env) => {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY,
      secretAccessKey: env.R2_SECRET_KEY,
    },
  });
};

export const signedUrlPut = async (env: Env, bucketName: string, key: string) =>
  await getSignedUrl(getR2Client(env), new PutObjectCommand({ Bucket: bucketName, Key: key }), { expiresIn: 3600 });

export const signedUrlGet = async (env: Env, bucketName: string, key: string, days: number) =>
  await getSignedUrl(getR2Client(env), new GetObjectCommand({ Bucket: bucketName, Key: key }), { expiresIn: 60 * 60 * 24 * days });

export const getObjects = async (env: Env, bucketName: string, prefix: string) => {
  const response = await getR2Client(env).send(new ListObjectsV2Command({ Bucket: bucketName, Prefix: prefix }));
  if (!response.Contents) {
    return [];
  }
  return response.Contents;
};

export const deleteFile = async (env: Env, bucketName: string, key: string) => {
  const url = await getSignedUrl(getR2Client(env), new DeleteObjectCommand({ Bucket: bucketName, Key: key }), { expiresIn: 60 });
  return await fetch(url, { method: 'DELETE' });
};
