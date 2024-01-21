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
  useEffect(() => {
    setInterval(() => {
      console.log("hi")
    }, 1000)
    console.log("hey")
  }, [])

  return (
    <div className="flex gap-2 p-2 border-2 border-black rounded-lg w-full">
      {props.icon && <span>{props.icon}</span>}
      <div className="flex flex-col w-full gap-2">
        {props.title && (
          <span className="font-bold text-lg">{props.title}</span>
        )}
        <span>{props.children}</span>
      </div>
    </div>
  )
}
