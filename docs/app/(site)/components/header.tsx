// "use client";
// import { useState } from "react";
// // import { usePathname } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { HiUser, HiMail, HiLockClosed } from "react-icons/hi";
// import { HiX } from "react-icons/hi";

// export default function Header() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSignupOpen, setIsSignupOpen] = useState(false);
//   const [isLoginOpen, setIsLoginOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };
//   return (
//     <header className="">
//       <div className="text-center sm:text-lg text-sm font-semibold p-2 text-white bg-(--pinkd)">
//         Welcome to our Store! Enjoy 10% off your first order with code:
//         WELCOME10
//       </div>

//       <div className="container mx-auto px-4 lg:py-4 flex">
//         <div className="relative lg:hidden flex items-center justify-between h-16">
//           <div className="flex items-center lg:hidden">
//             <button
//               type="button"
//               className="inline-flex items-center justify-center p-2 rounded-md text-black focus:outline-none"
//               onClick={toggleMenu}
//             >
//               <span className="sr-only">Open main menu</span>
//               {/* Hamburger icon */}
//               <svg
//                 className="block h-6 w-6"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//         <div className="flex justify-between items-center w-full *:lg:w-[33.3%]">
//           <div>
//             <div className="sm:max-w-[200px] max-w-[100px]">
//               <Image
//                 src="/assets/funtook-logo.svg"
//                 alt="Funtook"
//                 className="w-full h-auto"
//                 width={500}
//                 height={500}
//               />
//             </div>
//           </div>

//           <div className="w-full max-w-md lg:block hidden">
//             <form className="flex items-center mx-auto rounded-md overflow-hidden">
//               <label htmlFor="simple-search" className="sr-only">
//                 Search
//               </label>
//               <div className="relative w-full">
//                 <input
//                   type="text"
//                   id="simple-search"
//                   className="px-3 py-2.5 bg-(--pinkl) rounded-base outline-none text-heading text-sm block w-full placeholder:text-[#7B7A7A]"
//                   placeholder="Search For Decorations...."
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="inline-flex items-center justify-center shrink-0 text-white bg-(--pinkd) hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs rounded-base w-10 h-10 focus:outline-none"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   width={24}
//                   height={24}
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     stroke="currentColor"
//                     strokeLinecap="round" // Corrected to camelCase
//                     strokeWidth={2} // Corrected to camelCase
//                     d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
//                   />
//                 </svg>

//                 <span className="sr-only">Icon description</span>
//               </button>
//             </form>
//           </div>

//           <div className="flex gap-5 items-center justify-end">
//             <Link href="#" className="lg:block hidden">
//               <div className="flex gap-1 items-center">
//                 <Image
//                   src="/assets/icons/call.svg"
//                   className="w-full h-auto max-w-6"
//                   alt="call"
//                   width={100}
//                   height={100}
//                 />
//                 Contact
//               </div>
//             </Link>
//             <Link href="#">
//               <div className="flex gap-1 items-center">
//                 <Image
//                   src="/assets/icons/cart.svg"
//                   className="w-full h-auto max-w-6"
//                   alt="call"
//                   width={100}
//                   height={100}
//                 />
//                 <div className="lg:flex hidden">Cart</div>
//               </div>
//             </Link>
//             <>
//               {/* Signup Button */}
//               <button onClick={() => setIsSignupOpen(true)}>
//                 <div className="md:block hidden bg-(--pinkd) text-white py-2 px-5 rounded-md">
//                   Sign Up
//                 </div>

//                 <div className="md:hidden">
//                   <svg
//                     className="w-6 h-6 text-black"
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//               </button>

//               {/* ================= SIGNUP POPUP ================= */}
//               {isSignupOpen && (
//                 <div className="fixed inset-0 backdrop-blur-[3px] flex justify-center z-50">
//                   <div className="relative w-full max-w-[350px] rounded-2xl shadow-xl p-8 h-fit top-[210px] bg-[#ffffffde] border-[3px] border-[#D8D8D8]">
//                     {/* Close */}
//                     <button
//                       onClick={() => setIsSignupOpen(false)}
//                       className="absolute top-0 right-0 bg-[#701C5A] text-white rounded-tr-[13px] rounded-bl-[15px] w-10 h-10 flex items-center justify-center text-sm"
//                     >
//                       {/* ✕ */}
//                       <HiX className="text-lg border-2  rounded-full" />
//                     </button>

//                     <h2 className="text-center text-2xl font-semibold mb-6">
//                       Sign Up
//                     </h2>

//                     {/* Name */}
//                     <div className="mb-4">
//                       <div className="flex items-center border-b pb-1 mt-1">
//                         <input
//                           className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
//                           placeholder="Name"
//                         />
//                         <HiUser className="text-black text-xl" />
//                       </div>
//                     </div>

//                     {/* Email */}
//                     <div className="mb-4">
//                       <div className="flex items-center border-b pb-1 mt-1">
//                         <input
//                           className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
//                           placeholder="Email"
//                         />
//                         <HiMail className="text-black text-xl" />
//                       </div>
//                     </div>

//                     {/* Password */}
//                     <div className="mb-4">
//                       <div className="flex items-center border-b pb-1 mt-1 placeholder-black pl-6">
//                         <input
//                           type="password"
//                           className="w-full outline-none bg-transparent text-lg placeholder-black pl-[2px]"
//                           placeholder="Password"
//                         />
//                         <HiLockClosed className="text-black text-xl" />
//                       </div>
//                     </div>

//                     {/* Terms */}
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         className="w-4 h-4 bg-gray-300 accent-[#701C5A] rounded"
//                       />
//                       {/* <input
//                         type="checkbox"
//                         className="w-4 h-4 appearance-none border border-[#AEAEAE] rounded bg-[#AEAEAE] checked:bg-[#701C5A]"
//                       /> */}
//                       <p className="text-sm text-gray-700">
//                         I agree to the terms & conditions
//                       </p>
//                     </div>

//                     {/* Signup Button */}
//                     <button className="w-full mt-6 bg-[linear-gradient(180deg,rgba(252,110,136,1)_0%,rgba(153,60,66,1)_130%)] text-white py-1 rounded-lg font-semibold">
//                       Sign Up
//                     </button>

//                     {/* Switch to Login */}
//                     <p className="text-center text-sm text-gray-700 mt-4">
//                       Already have an account?
//                       <button
//                         onClick={() => {
//                           setIsSignupOpen(false);
//                           setIsLoginOpen(true);
//                         }}
//                         className="text-[#3905B3] ml-1 font-medium"
//                       >
//                         Login
//                       </button>
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* ================= LOGIN POPUP ================= */}
//               {isLoginOpen && (
//                 <div className="fixed inset-0 backdrop-blur-[3px] flex  justify-center z-50">
//                   <div className="relative w-full max-w-[350px] rounded-2xl shadow-xl p-8 h-fit top-[210px] bg-[#ffffffde] border-[3px] border-[#D8D8D8]">
//                     {/* Close */}
//                     <button
//                       onClick={() => setIsLoginOpen(false)}
//                       className="absolute top-0 right-0 bg-[#701C5A] text-white rounded-tr-[13px] rounded-bl-[15px] w-10 h-10 flex items-center justify-center text-sm"
//                     >
//                       {/* ✕ */}
//                       <HiX className="text-lg border-2  rounded-full" />
//                     </button>

//                     <h2 className="text-center text-2xl font-semibold mb-6">
//                       Login
//                     </h2>

//                     {/* Email */}
//                     <div className="mb-4">
//                       <div className="flex items-center border-b pb-1 mt-1">
//                         <input
//                           className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
//                           placeholder="Email"
//                         />
//                         <HiMail className="text-black text-xl" />
//                       </div>
//                     </div>

//                     {/* Password */}
//                     <div className="mb-4">
//                       <div className="flex items-center border-b pb-1 mt-1">
//                         <input
//                           type="password"
//                           className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
//                           placeholder="Password"
//                         />
//                         <HiLockClosed className="text-black text-xl" />
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between mt-3">
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           className="w-4 h-4 text-blue-600 bg-gray-300 rounded border-gray-300"
//                         />
//                         <span className="text-sm text-gray-700">
//                           Remember me
//                         </span>
//                       </label>

//                       <p className="text-sm text-[#3905B3] cursor-pointer hover:underline">
//                         Forget Password?
//                       </p>
//                     </div>

//                     {/* Login Button */}
//                     <button className="w-full mt-6 bg-[#FC6E88] text-white py-1 rounded-lg font-semibold">
//                       Login
//                     </button>

//                     {/* Switch to Signup */}
//                     <p className="text-center text-sm text-gray-700 mt-4">
//                       Don’t have an account?
//                       <button
//                         onClick={() => {
//                           setIsLoginOpen(false);
//                           setIsSignupOpen(true);
//                         }}
//                         className="text-[#3905B3] ml-1 font-medium"
//                       >
//                         Sign Up
//                       </button>
//                     </p>

//                     <p className="text-center text-sm text-gray-700 mt-4">By continuing I agree to Funtook <span className="text-[#3905B3] ml-1 font-medium">Term & condition</span>  and <span className="text-[#3905B3] ml-1 font-medium">Privacy Policy</span> </p>

//                   </div>
//                 </div>
//               )}
//             </>
//           </div>
//         </div>
//       </div>

//       <nav className="">
//         <div className="border-t border-b border-gray-300 py-3 lg:block hidden">
//           {/* Desktop Menu */}
//           <div className="hidden sm:flex sm:items-center sm:justify-center space-x-4 *:px-3 *:py-1 *:text-black *:hover:text-(--pinkd) *:transition-all *:ease-in-out">
//             <Link
//               href="#Birthday"
//               onClick={(e) => {
//                 e.preventDefault();
//                 document.getElementById("Birthday")?.scrollIntoView({
//                   behavior: "smooth",
//                   block: "start",
//                 });
//               }}
//             >
//               Birthday
//             </Link>
//             <Link href="#Anniversary">Anniversary</Link>
//             <Link href="#Baby-Welcome">Baby Welcome</Link>
//             <Link href="#Other-Categories">Other Categories</Link>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <div className={`${isOpen ? "block" : "hidden"} lg:hidden`}>
//           <div className="px-2 pt-2 pb-3 space-y-1 *:text-black *:block *:px-3 *:py-2 *:rounded-md *:text-base *:font-medium *:hover:bg-gray-700">
//             <Link href="#Birthday">Birthday</Link>
//             <Link href="#Anniversary">Anniversary</Link>
//             <Link href="#Baby-Welcome">Baby Welcome</Link>
//             <Link href="#Other-Categories">Other Categories</Link>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }



"use client";
import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HiUser, HiMail, HiLockClosed } from "react-icons/hi";
import { HiX } from "react-icons/hi";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Signup failed");
      }

      // ✅ Success
      alert("Signup successful 🎉");
      setIsSignupOpen(false);
      setIsLoginOpen(true);

      setSignupData({ name: "", email: "", password: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // ✅ Login success
      console.log("Login success:", data);

      // Example: save token / user
      localStorage.setItem("token", data.token);

      // Close modal
      setIsLoginOpen(false);

      // Optional: redirect
      // router.push("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);


  const searchProducts = async (query: string) => {
    if (!query) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`
      );

      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      searchProducts(search);
    }, 400); // debounce 400ms

    return () => clearTimeout(delay);
  }, [search]);


  return (
    <header className="">
      <div className="text-center sm:text-lg text-sm font-semibold p-2 text-white bg-(--pinkd)">
        Welcome to our Store! Enjoy 10% off your first order with code:
        WELCOME10
      </div>

      <div className="container mx-auto px-4 lg:py-4 flex">
        <div className="relative lg:hidden flex items-center justify-between h-16">
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-black focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center w-full *:lg:w-[33.3%]">
          <div>
            <div className="sm:max-w-[200px] max-w-[100px]">
              <Image
                src="/assets/funtook-logo.svg"
                alt="Funtook"
                className="w-full h-auto"
                width={500}
                height={500}
              />
            </div>
          </div>

          <div className="w-full max-w-md lg:block hidden">
            <form className="flex items-center mx-auto rounded-md overflow-hidden">
              <label htmlFor="simple-search" className="sr-only">
                Search
              </label>
              {/* <div className="relative w-full">
                <input
                  type="text"
                  id="simple-search"
                  className="px-3 py-2.5 bg-(--pinkl) rounded-base outline-none text-heading text-sm block w-full placeholder:text-[#7B7A7A]"
                  placeholder="Search For Decorations...."
                  required
                />
              </div> */}

              <div className="relative w-full">
                <input
                  type="text"
                  id="simple-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-2.5 bg-(--pinkl) rounded-base outline-none text-heading text-sm block w-full placeholder:text-[#7B7A7A]"
                  placeholder="Search For Decorations...."
                />
              </div>


              <button
                type="submit"
                className="inline-flex items-center justify-center shrink-0 text-white bg-(--pinkd) hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs rounded-base w-10 h-10 focus:outline-none"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round" // Corrected to camelCase
                    strokeWidth={2} // Corrected to camelCase
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>

                <span className="sr-only">Icon description</span>
              </button>
            </form>
          </div>

          <div className="flex gap-5 items-center justify-end">
            <Link href="#" className="lg:block hidden">
              <div className="flex gap-1 items-center">
                <Image
                  src="/assets/icons/call.svg"
                  className="w-full h-auto max-w-6"
                  alt="call"
                  width={100}
                  height={100}
                />
                Contact
              </div>
            </Link>
            <Link href="#">
              <div className="flex gap-1 items-center">
                <Image
                  src="/assets/icons/cart.svg"
                  className="w-full h-auto max-w-6"
                  alt="call"
                  width={100}
                  height={100}
                />
                <div className="lg:flex hidden">Cart</div>
              </div>
            </Link>
            <>
              {/* Signup Button */}
              <button onClick={() => setIsSignupOpen(true)}>
                <div className="md:block hidden bg-(--pinkd) text-white py-2 px-5 rounded-md">
                  Sign Up
                </div>

                <div className="md:hidden">
                  <svg
                    className="w-6 h-6 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>

              {/* ================= SIGNUP POPUP ================= */}
              {isSignupOpen && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex justify-center z-50">
                  <div className="relative w-full max-w-[350px] rounded-2xl shadow-xl p-8 h-fit top-[210px] bg-[#ffffffde] border-[3px] border-[#D8D8D8]">
                    {/* Close */}
                    <button
                      onClick={() => setIsSignupOpen(false)}
                      className="absolute top-0 right-0 bg-[#701C5A] text-white rounded-tr-[13px] rounded-bl-[15px] w-10 h-10 flex items-center justify-center text-sm"
                    >
                      {/* ✕ */}
                      <HiX className="text-lg border-2  rounded-full" />
                    </button>

                    <h2 className="text-center text-2xl font-semibold mb-6">
                      Sign Up
                    </h2>

                    {/* Name */}
                    <div className="mb-4">
                      <div className="flex items-center border-b pb-1 mt-1">
                        {/* <input
                          className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
                          placeholder="Name"
                        /> */}
                        <input
                          className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
                          placeholder="Name"
                          value={signupData.name}
                          onChange={(e) =>
                            setSignupData({ ...signupData, name: e.target.value })
                          }
                        />

                        <HiUser className="text-black text-xl" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                      <div className="flex items-center border-b pb-1 mt-1">
                        {/* <input
                          className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
                          placeholder="Email"
                        /> */}
                        <input
                          className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
                          placeholder="Email"
                          value={signupData.email}
                          onChange={(e) =>
                            setSignupData({ ...signupData, email: e.target.value })
                          }
                        />
                        <HiMail className="text-black text-xl" />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                      <div className="flex items-center border-b pb-1 mt-1 placeholder-black pl-6">
                        {/* <input
                          type="password"
                          className="w-full outline-none bg-transparent text-lg placeholder-black pl-[2px]"
                          placeholder="Password"
                        /> */}
                        <input
                          type="password"
                          className="w-full outline-none bg-transparent text-lg placeholder-black pl-[2px]"
                          placeholder="Password"
                          value={signupData.password}
                          onChange={(e) =>
                            setSignupData({ ...signupData, password: e.target.value })
                          }
                        />
                        <HiLockClosed className="text-black text-xl" />
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 bg-gray-300 accent-[#701C5A] rounded"
                      />
                      {/* <input
                        type="checkbox"
                        className="w-4 h-4 appearance-none border border-[#AEAEAE] rounded bg-[#AEAEAE] checked:bg-[#701C5A]"
                      /> */}
                      <p className="text-sm text-gray-700">
                        I agree to the terms & conditions
                      </p>
                    </div>

                    {/* Signup Button */}
                    <button
                      onClick={handleSignup}
                      disabled={loading}
                      className="w-full mt-6 bg-[linear-gradient(180deg,rgba(252,110,136,1)_0%,rgba(153,60,66,1)_130%)] text-white py-1 rounded-lg font-semibold disabled:opacity-60"
                    >
                      {loading ? "Signing up..." : "Sign Up"}
                    </button>

                    {/* Switch to Login */}
                    <p className="text-center text-sm text-gray-700 mt-4">
                      Already have an account?
                      <button
                        onClick={() => {
                          setIsSignupOpen(false);
                          setIsLoginOpen(true);
                        }}
                        className="text-[#3905B3] ml-1 font-medium"
                      >
                        Login
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* ================= LOGIN POPUP ================= */}
              {isLoginOpen && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex  justify-center z-50">
                  <div className="relative w-full max-w-[350px] rounded-2xl shadow-xl p-8 h-fit top-[210px] bg-[#ffffffde] border-[3px] border-[#D8D8D8]">
                    {/* Close */}
                    <button
                      onClick={() => setIsLoginOpen(false)}
                      className="absolute top-0 right-0 bg-[#701C5A] text-white rounded-tr-[13px] rounded-bl-[15px] w-10 h-10 flex items-center justify-center text-sm"
                    >
                      {/* ✕ */}
                      <HiX className="text-lg border-2  rounded-full" />
                    </button>

                    <h2 className="text-center text-2xl font-semibold mb-6">
                      Login
                    </h2>

                    {/* Email */}
                    <div className="mb-4">
                      <div className="flex items-center border-b pb-1 mt-1">
                        {/* <input
                          className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
                          placeholder="Email"
                        /> */}
                        <input
                          className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <HiMail className="text-black text-xl" />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                      <div className="flex items-center border-b pb-1 mt-1">
                        {/* <input
                          type="password"
                          className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
                          placeholder="Password"
                        /> */}
                        <input
                          type="password"
                          className="w-full outline-none bg-transparent text-lg placeholder-black pl-6"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <HiLockClosed className="text-black text-xl" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-300 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">
                          Remember me
                        </span>
                      </label>

                      <p className="text-sm text-[#3905B3] cursor-pointer hover:underline">
                        Forget Password?
                      </p>
                    </div>

                    {/* Login Button */}
                    {/* <button className="w-full mt-6 bg-[#FC6E88] text-white py-1 rounded-lg font-semibold">
                      Login
                    </button> */}

                    <button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full mt-6 bg-[#FC6E88] text-white py-1 rounded-lg font-semibold disabled:opacity-60"
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>


                    {/* Switch to Signup */}
                    <p className="text-center text-sm text-gray-700 mt-4">
                      Don’t have an account?
                      <button
                        onClick={() => {
                          setIsLoginOpen(false);
                          setIsSignupOpen(true);
                        }}
                        className="text-[#3905B3] ml-1 font-medium"
                      >
                        Sign Up
                      </button>
                    </p>

                    <p className="text-center text-sm text-gray-700 mt-4">By continuing I agree to Funtook <span className="text-[#3905B3] ml-1 font-medium">Term & condition</span>  and <span className="text-[#3905B3] ml-1 font-medium">Privacy Policy</span> </p>

                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      </div>

      <nav className="">
        <div className="border-t border-b border-gray-300 py-3 lg:block hidden">
          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:justify-center space-x-4 *:px-3 *:py-1 *:text-black *:hover:text-(--pinkd) *:transition-all *:ease-in-out">
            <Link href="/view-all?category=Birthday%20Decoration">
              Birthday
            </Link>
            <Link href="/view-all?category=Anniversary%20Decoration">Anniversary</Link>
            <Link href="/view-all?category=Baby%20Welcome">Baby Welcome</Link>
            <Link href="/view-all">Other Categories</Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isOpen ? "block" : "hidden"} lg:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 *:text-black *:block *:px-3 *:py-2 *:rounded-md *:text-base *:font-medium *:hover:bg-gray-700">
            <Link href="/view-all?category=Birthday%20Decoration">Birthday</Link>
            <Link href="/view-all?category=Anniversary%20Decoration">Anniversary</Link>
            <Link href="/view-all?category=Baby%20Welcome">Baby Welcome</Link>
            <Link href="/view-all">Other Categories</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
