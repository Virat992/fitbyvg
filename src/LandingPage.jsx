export default function LandingPage() {
  return (
    <div className="h-screen w-full max-w-[420px] bg-gray-300">
      {/* Main container*/}
      <div className="  flex flex-col justify-center items-center pt-4">
        <p className="text-[15px] font font-bold text-gray-700">Welcome to</p>
        <img
          className="w-[150px] mt-8"
          src="/Images/main-logo.png"
          alt="Fitbyvg"
        />
      </div>
      <div className="w-full h-[350px] bg-amber-300 my-6">
        <h2>Caraosal image</h2>
      </div>
      <div className="flex flex-col justify-center items-center gap-6 ">
        <button className=" font-bold border-none px-2 py-3 bg-blue-600 text-white w-80 border rounded-4xl">
          Sign up for free
        </button>
        <button className="text-blue-600 font-bold ">Log In</button>
        <p className="text-black">Made with ❤️ by Virat Gajjar</p>
      </div>
    </div>
  );
}
