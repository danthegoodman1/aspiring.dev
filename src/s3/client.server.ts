import { S3 } from "@aws-sdk/client-s3"

export const s3Client = new S3({
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: process.env.S3_ENDPOINT.includes("localhost"),
})
