import MarkdownRenderer from "~/components/MarkdownRenderer"

export default function TestPost() {
  return (
    <MarkdownRenderer
      content={`
    # Test

    {% callout title="This is a title!" icon="😊" %}

    Hey this is a callout

    {% /callout %}
  `}
    />
  )
}
