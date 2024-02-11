/**
 * Custom image for rendering wrapping div (to put in the middle)
 */

import { ReactNode } from "react"

export function Link(props: {
  children?: ReactNode
  href?: string
  title?: string
}) {
  return (
    <a href={props.href} target="_blank">
      {props.children}
    </a>
  )
}

export const link = {
  render: "Link",
  attributes: {
    href: {
      type: String,
    },
    title: {
      type: String,
    },
  },
}
