const { GetObjectCommand, PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v1: uuidv1 } = require('uuid');

const { AWS_DEFAULT_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_DATA, AWS_S3_BUCKET_TMP, ENV } =
  process.env;

const params = { region: AWS_DEFAULT_REGION };
if (ENV === 'dev' && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
  params.credentials = {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  };
}

const s3 = new S3Client(params);

const getFile = fileName => s3.send(new GetObjectCommand({ Bucket: AWS_S3_BUCKET_DATA, Key: fileName }));

const generateName = ext => `${uuidv1({ msecs: Date.now(), nsecs: 5678 })}.${ext}`;

const getType = ext => {
  const types = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    png: 'image/png',
    pdf: 'application/pdf'
  };
  return types[ext] || null;
};

const getSign = async ext => {
  const fileName = generateName(ext);
  const fileType = getType(ext);
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET_TMP,
    Key: fileName,
    ContentType: fileType
  });

  const signedRequest = await getSignedUrl(s3, command, { expiresIn: 300 });
  return {
    signedRequest,
    url: `https://${AWS_S3_BUCKET_TMP}.s3.${AWS_DEFAULT_REGION}.amazonaws.com/${fileName}`,
    fileType,
    fileName
  };
};

module.exports = {
  generateName,
  getFile,
  getSign
};
