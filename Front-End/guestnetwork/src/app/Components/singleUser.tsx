

export default function SingleUserComponent(){
  return (
    <div className="flex flex-col items-center w-full space-y-3 bg-white rounded-lg shadow-md p-4">
      <form className="flex flex-col items-center w-full space-y-3">
        <h3 className="text-xl font-bold pb-4">User registration</h3>
        <input
          type="mac-address"
          placeholder="Mac Address"
          className="bg-gray-300 text-black rounded-lg px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Username"
          className="bg-gray-300 text-black rounded-lg px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Time needed"
          className="bg-gray-300 text-black rounded-lg px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          className="mt-2 bg-[#002757] text-white py-1 px-4 rounded-md text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  )
}



