// Had to return from server because otherwise shiki tries to fetch stuff

import { Children, ReactNode } from "react"
import * as shiki from "shiki"

export const highlighter = await shiki.getHighlighter({
  theme: "dracula-soft",
})

export function Fence(props: { children?: ReactNode; language: string }) {
  const code = Children.toArray(props.children)[0] as string
  const html = highlighter.codeToHtml(code.trim(), {
    lang: props.language,
  })
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
