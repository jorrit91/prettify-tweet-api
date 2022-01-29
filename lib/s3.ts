import { S3 } from "aws-sdk"

let client: S3 | null = null

export function getS3Client(): S3 {
  if (!process.env.SCALEWAY_SECRET_KEY) {
    console.error("SCALEWAY_SECRET_KEY not found")
  }
  if (!process.env.SCALEWAY_ACCESS_KEY) {
    console.error("SCALEWAY_ACCESS_KEY not found")
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
      Body: stream,
      Bucket: "prettify-tweet-spaces",
      ContentType: mimetype,
    })
    .promise()

  const url = client.getSignedUrl("getObject", {
    Key,
    Bucket: "prettify-tweet-spaces",
    Expires: 60 * 5,
  })

  return url
}
