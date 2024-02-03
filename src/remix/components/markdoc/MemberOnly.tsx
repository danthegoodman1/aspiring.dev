import { Schema } from "@markdoc/markdoc"
import { PropsWithChildren } from "react"
import JoinCTA from "../JoinCTA"
import { emailName } from "~/routes/posts.$slug"
import JoinToSeeCTA from "../JoinToSeeCTA"

export const member: Schema = {
  render: "MemberOnly",
  children: ["paragraph", "tag", "list"],
  attributes: {
    member: {
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

export function MemberOnly(
  props: PropsWithChildren<{
    title?: string
    description?: string
    member?: boolean
  }>
) {
  const member = !!props.member

  return (
    <div className="flex gap-2 my-4 p-2 sm:p-3 sm:gap-3 shadow-md border-[1px] border-neutral-100 rounded-lg w-full">
      <div className="flex flex-col w-full gap-2 sm:gap-3">
        <div className="flex gap-2">
          <span className="font-bold text-lg text-neutral-600">
            🤗 Member only:
          </span>
          {props.title && (
            <span className="font-bold text-lg text-neutral-600">
              {props.title}
            </span>
          )}
        </div>
        {member && <span>{props.children}</span>}
        {!member && (
          // <a className="rounded-md py-2 my-2 px-6 bg-black text-white flex items-center justify-center grow-0  hover:bg-neutral-700 disabled:bg-neutral-700 w-full self-baseline !no-underline cursor-pointer">
          //   Subscribe to get instant access
          // </a>
          <>
            <p>{props.description}</p>
            <JoinToSeeCTA emailName={emailName} />
          </>
        )}
      </div>
    </div>
  )
}
