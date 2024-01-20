import { readFile } from "fs/promises"

export function extractError(e: any | Error) {
  return Object.fromEntries(
    Object.getOwnPropertyNames(e).map((key) => [key, e[key]])
  )
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export async function readMarkdown(fileName: string) {
  const file = await readFile(`src/remix/markdown/${fileName}`)
  return file.toString()
}
