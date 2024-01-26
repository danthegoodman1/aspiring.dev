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
    <div className="flex gap-2 my-4 p-2 sm:p-3 sm:gap-3 shadow-md border-[1px] border-neutral-100 rounded-lg w-full">
      <div className="flex flex-col w-full gap-2 sm:gap-3">
        <div className="flex gap-2">
          <span className="font-bold text-lg text-neutral-600">
            ⭐️ Subscriber only:
          </span>
          {props.title && (
            <span className="font-bold text-lg text-neutral-600">
              {props.title}
            </span>
          )}
        </div>
        {subscribed && <span>{props.children}</span>}
        {!subscribed && <p>Join and Subscribed to see this content!</p>}
      </div>
    </div>
  )
}
