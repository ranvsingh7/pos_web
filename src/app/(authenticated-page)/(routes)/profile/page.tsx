"use client";
import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";

type User = {
  username: string;
  _id: string;
  email: string;
  mobile: string;
  createdOn: string;
};

function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      // console.log("logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log("logout failed: ", error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const data = await axios.get("/api/users/me");
      // console.log("user data: ", data.data.user);
      setUser(data.data.user);
      setLoading(false);
    } catch (error: any) {
      console.log("get user data failed: ", error.message);
      setLoading(false);
    }
  };

  const resetPassword = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (password.newPassword !== password.confirmPassword) {
        return toast.error("Passwords do not match");
      }
      const response = await axios.post("/api/users/reset-password", {
        email: user?.email,
        password: password.currentPassword,
        newPassword: password.newPassword,
      });
      toast.success(response.data.message);
      console.log("response data: ", response.data);
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.log("reset password failed: ", error.message);
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric" as const,
      month: "short" as const,
      year: "numeric" as const,
    };
    return date.toLocaleDateString("en-GB", options);
  };

  // console.log(user);

  return !loading ? (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-black">ProfilePage</h1>
      <hr className="my-4" />
      <h2 className="text-xl font-semibold mb-2 text-black">Profile</h2>
      <p className="text-gray-700 mb-4">Username: {user?.username}</p>
      <p className="text-gray-700 mb-4">Email: {user?.email} </p>
      <p className="text-gray-700 mb-4">Mobile: {user?.mobile}</p>
      <p className="text-gray-700 mb-4">
        Created On: {formatDate(user?.createdOn!)}
      </p>
      <Link href={`/profile/${user?._id}`} className="text-purple-400">
        {user?._id}
      </Link>
      <hr className="my-4" />
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger className="text-red-500">
            {/* <Button variant={"outline"}>Reset Password</Button> */}
            Reset Password
          </DialogTrigger>
          <DialogContent className="max-w-[320px] top-[200px]">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Reset Password
              </DialogTitle>
              <form
                onSubmit={resetPassword}
                className="grid w-full items-center gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    type="password"
                    id="currentPassword"
                    placeholder="Enter Current Password"
                    autoComplete="current-password"
                    value={password.currentPassword}
                    onChange={(e) => {
                      setPassword({
                        ...password,
                        currentPassword: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter New Password"
                    autoComplete="new-password"
                    value={password.newPassword}
                    onChange={(e) => {
                      setPassword({ ...password, newPassword: e.target.value });
                    }}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    value={password.confirmPassword}
                    onChange={(e) => {
                      setPassword({
                        ...password,
                        confirmPassword: e.target.value,
                      });
                    }}
                  />
                </div>
              </form>

              <div className="p-2 mt-8 flex gap-2 float-right justify-end">
                <DialogClose asChild>
                  <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
                <Button
                  variant={"secondary"}
                  color="red"
                  onClick={resetPassword}>
                  <CircularProgress
                    size={16}
                    className="mr-2"
                    color="inherit"
                  />
                  Reset Password
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <button
          onClick={logout}
          className="px-4 py-2 border bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <CircularProgress size={50} />
    </div>
  );
}

export default ProfilePage;
