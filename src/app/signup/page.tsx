"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    mobile: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("response data: ", response);
      console.log("response: ", response);
      toast.success("Signup successful");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.log("signup failed: ", error);
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="border border-white flex rounded-xl flex-col w-max m-auto p-2 mt-10">
      <h1 className="text-xl font-semibold">
        {loading ? "Processing" : "Signup"}
      </h1>
      <hr className="my-4" />
      <label htmlFor="username">username</label>
      <input
        id="username"
        type="text"
        className="border w-max m-auto rounded-md p-2 text-black"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="username"
      />
      <br />
      <label htmlFor="email">email</label>
      <input
        id="email"
        type="email"
        className="border w-max m-auto rounded-md p-2 text-black"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
      />
      <br />
      <label htmlFor="mobile">mobile</label>
      <input
        id="mobile"
        type="text"
        className="border w-max m-auto rounded-md p-2 text-black"
        value={user.mobile}
        onChange={(e) => setUser({ ...user, mobile: e.target.value })}
        placeholder="mobile"
      />
      <br />
      <label htmlFor="password">password</label>
      <input
        id="password"
        type="password"
        className="border w-max m-auto rounded-md p-2 text-black"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
      />

      <br />

      <button
        onClick={onSignup}
        className="border w-max m-auto rounded-md p-2 bg-blue-500 text-white"
        disabled={!user.email || !user.password || !user.username}>
        Sign Up
      </button>
      <hr className="my-4" />
      <Link href="/login" className="flex m-auto">
        Login
      </Link>
    </div>
  );
}

export default SignupPage;
