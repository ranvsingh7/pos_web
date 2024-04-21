import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Avatar, Popover } from "@mui/material";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* <header>This is the header</header> */}
      <main>
        <div className="flex h-screen">
          <div className="border h-screen">
            <Sidebar />
          </div>
          <div className="w-full">
            <Header />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
