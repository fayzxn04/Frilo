"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();

  // Register User!
  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: registerEmail,
        createdAt: new Date(),
      });

      setRegisterEmail("");
      setRegisterPassword("");
      setName("");

      router.push("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-opacity-40 ">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-3 text-center"> X </h1>
        <h2 className="text-2xl text-black font-bold mb-8 text-center">
          Create your account
        </h2>
        <input
          type="text"
          placeholder="Name"
          className="py-2 px-4 border border-gray-300 w-full mb-4 rounded-md"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="email"
          placeholder="Email"
          className="py-2 px-4 border border-gray-300 w-full mb-4 rounded-md"
          value={registerEmail}
          onChange={(event) => {
            setRegisterEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          className="py-2 px-4 border border-gray-300 w-full mb-6 rounded-md"
          value={registerPassword}
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        />

        <button
          className="bg-gray-700 text-white px-4 py-2 w-full rounded-md mb-4 cursor-pointer"
          onClick={register}
        >
          Sign up
        </button>

        <div className="text-center">
          <span className="text-sm"> Already have an account? </span>
          <button
            onClick={() => router.push("/login")}
            className="bg-gray-500 text-white px-4 py-2 rounded-md ml-3 cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    </main>
  );
}
