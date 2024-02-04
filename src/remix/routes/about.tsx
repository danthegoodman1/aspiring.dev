import AboutSimple from "~/components/AboutSimple"

export default function About() {
  return (
    <div className="flex max-w-[1400px] w-full h-full flex-col py-4 md:py-10 gap-8">
      <article>
        <h1>About aspiring.dev</h1>
        <AboutSimple />
      </article>
    </div>
  )
}
