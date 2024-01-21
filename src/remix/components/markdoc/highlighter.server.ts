import * as shiki from "shiki"

export const highlighter = await shiki.getHighlighter({
  theme: "dracula-soft",
})
