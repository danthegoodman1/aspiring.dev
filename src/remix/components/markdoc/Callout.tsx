import { Schema } from "@markdoc/markdoc"
import { PropsWithChildren, useEffect } from "react"

export const callout: Schema = {
  render: "Callout",
  children: ["paragraph", "tag", "list"],
  attributes: {
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
    color: {
      type: String,
    },
  },
}

export function Callout(
  props: PropsWithChildren<{ title?: string; icon?: string; color?: string }>
) {
  return (
    <div className="flex p-2 gap-2 sm:gap-3 sm:p-3 border-2 border-black rounded-lg w-full my-2">
      {props.icon && <span className="text-2xl">{props.icon}</span>}
      <div className="flex flex-col w-full gap-2">
        {props.title && (
          <span className="font-bold text-lg">{props.title}</span>
        )}
        <div className="flex flex-col gap-4">{props.children}</div>
      </div>
    </div>
  )
}
