/**
 * Custom image for rendering wrapping div (to put in the middle)
 */

import { ReactNode } from "react"

export function BlockQuote(props: { children?: ReactNode }) {
  return (
    <div className="italic text-neutral-600 p-4 max-w-[90%] bg-neutral-100 rounded-lg mx-auto sm:mx-0">
      {props.children}
    </div>
  )
}

export const blockquote = {
  render: "BlockQuote",
}
