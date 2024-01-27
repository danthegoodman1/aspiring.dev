import { LoaderFunctionArgs } from "@remix-run/node"
import { listLatestDocumentsForCollection } from "src/db/documents.server"
import { DocumentRow } from "src/db/types"

interface sitemapURL {
  path: string
  lastMod: Date
}

export async function loader(args: LoaderFunctionArgs) {
  // Public pages that should be indexed by google
  const pages: sitemapURL[] = []

  const posts: DocumentRow[] =
    (await listLatestDocumentsForCollection("posts", {
      requirePublished: true,
    })) ?? []
  pages.push(
    ...posts.map((post) => {
      return {
        path: `/posts/${post.slug}`,
        lastMod: new Date(post.created_ms),
      } as sitemapURL
    })
  )

  return new Response(
    `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${pages.map((page) => {
        return `<url>
          <loc>${process.env.MY_URL}${page.path}</loc>
          <lastmod>${page.lastMod.toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>`
      })}
    </urlset>
  `,
    {
      headers: {
        "Content-Type": "application/xml",
        "xml-version": "1.0",
        encoding: "UTF-8",
        "cache-control": "public, max-age=600",
      },
    }
  )
}
