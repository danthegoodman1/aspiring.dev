import type { MetaFunction } from "@remix-run/node"
import { useEffect } from "react"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export default function Index() {
  return (
    <div>
      <h1 className="font-bold">I'll render blogs here at some point</h1>
    </div>
  )
}
