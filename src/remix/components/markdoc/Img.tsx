/**
 * Custom image for rendering wrapping div (to put in the middle)
 */

import { ReactNode } from "react"

export function Img(props: {
  children?: ReactNode
  src: string
  alt?: string
  title?: string
}) {
  // TODO: Make a lightbox
  return (
    <div className="w-full flex flex-col justify-center relative rounded-lg overflow-hidden p-1 ">
      <img src={props.src} alt={props.alt} title={props.alt} />
      {/* Caption */}
      {props.alt && (
        <div className="py-2 px-3 text-center text-sm opacity-75 w-full text-neutral-900">
          <p>{props.alt}</p>
        </div>
      )}
    </div>
  )
}

export const image = {
  render: "Img",
  attributes: {
    src: {
      type: String,
    },
    alt: {
      type: String,
    },
    title: {
      type: String,
    },
  },
}
