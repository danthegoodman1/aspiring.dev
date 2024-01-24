import { LoaderFunctionArgs } from "@remix-run/node"
import { s3Client } from "src/s3/client.server"

export async function loader(args: LoaderFunctionArgs) {
  const { asset } = args.params
  console.log("loading asset", asset)
  const item = await s3Client.getObject({
    Bucket: process.env.S3_BUCKET,
    Key: `posts/assets/${asset}`,
  })
  return new Response(item.Body?.transformToWebStream())
}
