"use client";
import { Avatar, Popover } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

type Props = {};

const Header = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      // console.log("logout successful");
      handleClose();
      router.push("/login");
    } catch (error: any) {
      console.log("logout failed: ", error.message);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const router = useRouter();
  const pathname = usePathname();
  return (
    <header className="flex justify-end border py-2 px-4">
      <Avatar aria-describedby={id} onClick={handleClick} component="button" />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className="mt-2 "
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}>
        <div className="p-1 w-[100px] text-center">
          <Link href={"/profile"}>
            <p
              className="p-2 hover:bg-slate-200 rounded-md text-slate-800 font-medium cursor-pointer"
              onClick={handleClose}>
              Profile
            </p>
          </Link>
          <p
            className="p-2 hover:bg-slate-200 rounded-md text-slate-800 font-medium cursor-pointer"
            onClick={handleLogout}>
            Logout
          </p>
        </div>
      </Popover>
    </header>
  );
};

export default Header;
