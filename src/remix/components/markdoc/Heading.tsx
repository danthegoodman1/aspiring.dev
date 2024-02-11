/**
 * Custom image for rendering wrapping div (to put in the middle)
 */

import { faLink } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Children, ReactNode } from "react"
import { classNames } from "src/utils"

export function Heading(props: { children?: ReactNode; level: string }) {
  const Tag = `h${props.level}` as keyof JSX.IntrinsicElements
  const slug = slugify(Children.toArray(props.children)[0] as string)
  return (
    <a
      href={`#${slug}`}
      className="relative group no-underline hover:no-underline"
    >
      <Tag className={classNames(slug)} id={slug}>
        {props.children}
        <FontAwesomeIcon
          icon={faLink}
          className="group-hover:inline hidden ml-1 w-[24px]"
        />
      </Tag>
    </a>
  )
}

export const heading = {
  render: "Heading",
  attributes: {
    level: {
      type: String,
    },
  },
}

function slugify(str: string) {
  return String(str)
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-") // remove consecutive hyphens
}
