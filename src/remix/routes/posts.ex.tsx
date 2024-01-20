import MarkdownRenderer from "~/components/MarkdownRenderer"

export default function TestPost() {
  return (
    <MarkdownRenderer
      content={`---

title: this is a frontmatter title

---

# Test

{% callout title="This is a title!" icon="😊" %}

{% callout title="This is a title!" icon="😊" %}

Hey this is a callout

{% $testvar %}

{% $title %}

{% /callout %}

{% /callout %}

\`{% subscriber subscribed=$subscribed %}\`

  `}
      variables={{
        testvar: "heyooo",
        subscribed: true,
      }}
    />
  )
}
