export default function JoinCTA(props: { emailName: string }) {
  return (
    <form className="shadow-xl border-2 border-black p-4 sm:p-6 flex flex-col justify-between rounded-lg">
      <h3>Join and get notified of new posts</h3>
      <input
        name={props.emailName}
        type="email"
        placeholder="Your email"
        className="px-3 my-4 py-2 border-black border-2 rounded-md drop-shadow-md"
      />
      <button className="rounded-md py-2 px-8 bg-black text-white flex items-center justify-center hover:bg-neutral-700 disabled:bg-neutral-700">
        Join
      </button>
    </form>
  )
}
