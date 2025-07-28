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
    <main className="h-screen w-[350px] text-center flex flex-col items-center justify-start bg-blue-100 mx-auto">
      <div className=" mb-20">
        <h1 className="text-4xl">Frilo</h1>
      </div>
      <div>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          className="border-2 border-red-400 px-4 py-2 mb-2"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={registerEmail}
          className="border-2 border-red-400 px-4 py-2 mb-2"
          onChange={(event) => {
            setRegisterEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={registerPassword}
          className="border-2 border-red-400 px-4 py-2 mb-4"
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        />

        <div
          className="border-2 border-red-400 px-4 py-2 mb-6 cursor-pointer"
          onClick={register}
        >
          Create User
        </div>
      </div>

      <div>
        Have an account?
        <span
          onClick={() => router.push("/login")}
          className="border-2 border-red-400 px-2 py-1 cursor-pointer mr-4"
        >
          Log in
        </span>
      </div>
    </main>
  );
}
