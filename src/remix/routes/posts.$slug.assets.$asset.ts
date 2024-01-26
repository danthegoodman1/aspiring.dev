import { LoaderFunctionArgs } from "@remix-run/node"
import { s3Client } from "src/s3/client.server"
import { getAssetS3Path } from "~/markdown/paths"

export async function loader(args: LoaderFunctionArgs) {
  const { asset, slug } = args.params
  const item = await s3Client.getObject({
    Bucket: process.env.S3_BUCKET,
    Key: getAssetS3Path(slug!, asset!),
  })
  return new Response(item.Body?.transformToWebStream())
}
