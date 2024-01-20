import Markdoc, { RenderableTreeNode } from "@markdoc/markdoc"
import React from "react"
import yaml from "js-yaml"
import { Callout, callout } from "./custom_tags/Callout"
import { SubscriberOnly, subscriber } from "./custom_tags/SubscriberOnly"

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
    variables: {
      ...frontmatter,
      ...props.variables,
    },
  })

  return Markdoc.renderers.react(content, React, {
    components: {
      Callout,
      SubscriberOnly,
    },
  })
}
