// Had to return from server because otherwise shiki tries to fetch stuff

import { Children, ReactNode } from "react"
import { ServerOnly } from "remix-utils/server-only"
import { highlighter } from "./highlighter.server"

export function Fence(props: { children?: ReactNode; language: string }) {
  return (
    <ServerOnly>
      {() => {
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
      }}
    </ServerOnly>
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
