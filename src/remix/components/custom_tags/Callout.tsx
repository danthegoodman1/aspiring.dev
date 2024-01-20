import { Schema } from "@markdoc/markdoc"
import { PropsWithChildren } from "react"

export const callout: Schema = {
  render: "Callout",
  children: ["paragraph", "tag", "list"],
  attributes: {
    icon: {
      type: String,
      // default: "note",
      // matches: ["caution", "check", "note", "warning"],
      // errorLevel: "critical",
    },
    title: {
      type: String,
    },
  },
}

export function Callout(
  props: PropsWithChildren<{ title?: string; icon?: string }>
) {
  return (
    <div className="flex gap-2 p-2 border-2 border-black rounded-lg w-full">
      {props.icon && <span>{props.icon}</span>}
      <div className="flex flex-col w-full">
        {props.title && (
          <span className="font-bold text-lg">{props.title}</span>
        )}
        <span>{props.children}</span>
      </div>
    </div>
  )
}
