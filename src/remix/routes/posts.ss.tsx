import { LoaderFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import MarkdownRenderer from "~/components/MarkdownRenderer.server"

export async function loader(args: LoaderFunctionArgs) {
  const jsx = (
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

\`\`\`typescript
const thing = 'hey'
\`\`\`

\`{% subscriber subscribed=$subscribed %}\`

`}
      variables={{
        testvar: "heyooo",
        subscribed: true,
      }}
    />
  )

  const rendered = renderToString(jsx)
  return json({
    rendered,
  })
}

export default function TestPost() {
  const data = useLoaderData<typeof loader>()
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: data.rendered,
      }}
    />
  )
}
