import { Children, ReactNode, useEffect, useState } from "react"
import { SyntaxHighlightPayload } from "~/routes/syntax_highlighter"

export function Fence(props: { children?: ReactNode; language: string }) {
  const code = Children.toArray(props.children)[0] as string
  const [html, setHTML] = useState("")
  async function loadHTML() {
    const res = await fetch("/syntax_highlighter", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        code,
        language: props.language,
      } as SyntaxHighlightPayload),
    })
    setHTML(await res.text())
  }

  useEffect(() => {
    loadHTML()
  }, [])

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
