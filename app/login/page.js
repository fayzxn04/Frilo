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
    <main className="h-screen w-[350px] text-center flex flex-col items-center justify-start bg-blue-100 mx-auto">
      <div className=" mb-20">
        <h1 className="text-4xl">Frilo</h1>
      </div>

      <div>
        <input
          type="email"
          placeholder="Enter your email"
          className="border-2 border-red-400 px-4 py-2 mb-2"
          value={loginEmail}
          onChange={(event) => {
            setLoginEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          className="border-2 border-red-400 px-4 py-2 mb-4"
          value={loginPassword}
          onChange={(event) => {
            setLoginPassword(event.target.value);
          }}
        />

        <div
          className="border-2 border-red-400 px-4 py-2 mb-6 cursor-pointer "
          onClick={login}
        >
          Login
        </div>
      </div>

      <div>
        Don&rsquo;t have an account?{" "}
        <span
          onClick={() => router.push("/signup")}
          className="border-2 border-red-400 px-2 py-1 cursor-pointer"
        >
          Sign up
        </span>
      </div>
    </main>
  );
}
