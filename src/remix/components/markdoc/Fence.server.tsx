import * as shiki from "shiki"
import { Children, ReactNode } from "react"

const highlighter = await shiki.getHighlighter({
  theme: "dracula-soft",
})

export function Fence(props: { children?: ReactNode; language: string }) {
  // return props.children
  // try making server side only
  const code = Children.toArray(props.children)[0] as string
  const html = highlighter.codeToHtml(code.trim(), {
    lang: props.language,
  })
  // return html
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}

export const fence = {
  render: "Fence",
  attributes: {
    language: {
      type: String,
    },
  },
}
