"use client";

import Link from "next/link";
import React, { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      // const response = NextResponse.json({ message: "Logout successful", success: true });
      const response = await axios.post("/api/users/login", user);
      console.log("🚀 ~ onLogin ~ response:", response);
      console.log("🚀 ~ onLogin ~ response.data:", response.data);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      console.log(
        "🚀 ~ onLogin ~ error.response.data.error:",
        error.response.data.error
      );
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="border border-white flex rounded-xl flex-col w-max m-auto p-2 mt-10">
      <h1 className="text-xl font-semibold">
        {loading ? "Processing" : "Login"}
      </h1>
      <hr />
      <label htmlFor="email" className="mt-4">
        email
      </label>
      <input
        className="border w-max m-auto rounded-md p-2 text-black"
        id="email"
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
      />
      <br />
      <label htmlFor="password">password</label>
      <input
        className="border w-max m-auto rounded-md p-2 text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
      />
      <br />
      <button
        onClick={onLogin}
        className="border w-max m-auto rounded-md p-2 bg-blue-500 text-white"
        disabled={!user.email || !user.password}>
        Log in
      </button>
      <hr className="my-4" />
      <Link href="/signup" className="flex m-auto">
        SignUp
      </Link>
    </div>
  );
}

export default LoginPage;
