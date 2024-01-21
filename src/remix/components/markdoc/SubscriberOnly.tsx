import { Schema } from "@markdoc/markdoc"
import { PropsWithChildren } from "react"

export const subscriber: Schema = {
  render: "SubscriberOnly",
  children: ["paragraph", "tag", "list"],
  attributes: {
    subscribed: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
}

export function SubscriberOnly(
  props: PropsWithChildren<{
    title?: string
    description?: string
    subscribed?: boolean
  }>
) {
  const subscribed = !!props.subscribed

  return (
    <div className="flex gap-2 p-2 border-2 border-black rounded-lg w-full">
      <div className="flex flex-col w-full gap-2">
        {props.title && (
          <span className="font-bold text-lg">{props.title}</span>
        )}
        <span>{props.children}</span>
        <p>Is subscribed: {subscribed ? "yes" : "no"}</p>
      </div>
    </div>
  )
}
