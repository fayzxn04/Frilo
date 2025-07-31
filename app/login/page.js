"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "firebase.config";
import { useRouter } from "next/navigation";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const router = useRouter();

  // Login User!
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      setLoginEmail("");
      setLoginPassword("");

      router.push("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen  bg-opacity-40 ">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-3 text-center">X</h1>
        <h2 className="text-2xl text-black mb-8 font-semibold">Sign in to X</h2>
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(event) => setLoginEmail(event.target.value)}
          className="px-4 py-2 border border-gray-300 w-full rounded-md mb-4  "
        />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(event) => setLoginPassword(event.target.value)}
          className="px-4 py-2 border border-gray-300 w-full rounded-md mb-4"
        />

        <button
          className="w-full rounded-md bg-gray-700 px-4 py-2 text-white cursor-pointer mb-4"
          onClick={login}
        >
          Sign in
        </button>

        <div className="text-center">
          <span className="text-sm"> Don&rsquo;t have an account? </span>
          <button
            onClick={() => router.push("/signup")}
            className=" bg-gray-500 px-4 py-2 cursor-pointer ml-3 text-white rounded-md"
          >
            Sign up
          </button>
        </div>
      </div>
    </main>
  );
}
