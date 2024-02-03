export default function PostFooter() {
  return (
    <div className="shadow-xl mt-10 border-[1px] border-neutral-100 p-4 sm:p-6 flex flex-col justify-between rounded-lg text-neutral-500 gap-2">
      <p>
        Share with your friends, foes, colleagues, or hackernews if you found
        this post interesting!
      </p>
      <p className="text-neutral-500">
        Discuss with me on Twitter/X{" "}
        <a
          target="_blank"
          href="https://twitter.com/Dan_The_Goodman"
          className="underline"
        >
          @Dan_The_Goodman
        </a>
      </p>
    </div>
  )
}
