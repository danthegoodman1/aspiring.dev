// This is safe to run as a component for client-hydration, but uses less-optimized FenceClient

import Markdoc from "@markdoc/markdoc"
import React from "react"
import yaml from "js-yaml"
import { Callout, callout } from "./markdoc/Callout"
import { SubscriberOnly, subscriber } from "./markdoc/SubscriberOnly"
import { Fence, fence } from "./markdoc/FenceClient"
import { Img, image } from "./markdoc/Img"

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
      image,
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
      Img,
    },
  })
}
