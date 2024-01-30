# aspiring.dev

## DB

I'm guessing it's an issue with the remix dependency tree, but I had to import the DB into the remix server files and pass into functions. Also I had to rename to `db.server.ts` to make it work as well.

## ENV Vars

For litestream, need:

```
LITESTREAM_SECRET_ACCESS_KEY
LITESTREAM_ACCESS_KEY_ID
LITESTREAM_S3_URL=s3://...
```
