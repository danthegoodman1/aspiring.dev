// This one should be run in a loader with renderToString(<>) to use a server-side rendering FenceClient

import Markdoc from "@markdoc/markdoc"
import React from "react"
import yaml from "js-yaml"
import { Callout, callout } from "./markdoc/Callout"
import { SubscriberOnly, subscriber } from "./markdoc/SubscriberOnly"
import { Fence, fence } from "./markdoc/Fence.server"

export default function MarkdownRenderer(props: {
  content: string
  variables?: Record<string, any>
}) {
  const ast = Markdoc.parse(props.content)

  const frontmatter: any = ast.attributes.frontmatter
    ? yaml.load(ast.attributes.frontmatter)
    : {}

  const content = Markdoc.transform(ast, {
    tags: {
      callout,
      subscriber,
    },
    nodes: {
      fence,
    },
    variables: {
      ...frontmatter,
      ...props.variables,
    },
  })

  return Markdoc.renderers.react(content, React, {
    components: {
      Callout,
      SubscriberOnly,
      Fence,
    },
  })
}
