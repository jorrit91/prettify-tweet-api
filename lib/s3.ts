import { S3 } from "aws-sdk"

let client: S3 | null = null

export function getS3Client(): S3 {
  if (!process.env.S3_ACCESS_KEY) {
    console.error("S3_ACCESS_KEY not found")
  }
  if (!process.env.S3_SECRET) {
    console.error("S3_SECRET not found")
  }
  if (!client) {
    return (client = new S3({
      endpoint: "ams3.digitaloceanspaces.com",
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET,
    }))
  }

  return client
}

type FileUploadArgs = {
  stream: any
  mimetype: string
  Key: string
}

export async function uploadFileGetTemporaryUrl({
  stream,
  mimetype,
  Key,
}: FileUploadArgs): Promise<string> {
  const client = getS3Client()

  await client
    .upload({
      Key,
      ACL: "authenticated-read",
      Body: stream,
      Bucket: process.env.SPACES_BUCKET,
      ContentType: mimetype,
    })
    .promise()

  const url = client.getSignedUrl("getObject", {
    Key,
    Bucket: process.env.SPACES_BUCKET,
    Expires: 60 * 5,
  })

  return url
}
