import { ActionFunctionArgs } from "@remix-run/node"
import * as shiki from "shiki"

const highlighter = await shiki.getHighlighter({
  theme: "dracula-soft",
})

export interface SyntaxHighlightPayload {
  language: string
  code: string
}

export async function action(args: ActionFunctionArgs) {
  const data = (await args.request.json()) as SyntaxHighlightPayload
  const html = highlighter.codeToHtml(data.code.trim(), {
    lang: data.language,
  })
  return new Response(html)
}
