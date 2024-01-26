export default function JoinAndSubCTA(props: { emailName: string }) {
  return (
    <form className="shadow-xl mt-10 border-2 border-black p-4 sm:p-6 flex flex-col justify-between rounded-lg">
      <h3>Join and get notified of new posts</h3>
      <h4 className="text-neutral-500">
        And subscribe to support more posts and see subscriber-only content!
      </h4>
      <input
        name={props.emailName}
        type="email"
        placeholder="Your email"
        className="px-3 my-4 py-2 border-black border-2 rounded-md drop-shadow-md"
      />
      <a className="rounded-md py-2 px-8 bg-black text-white flex items-center justify-center hover:bg-neutral-700 disabled:bg-neutral-700 !no-underline w-full">
        Join
      </a>
    </form>
  )
}
