"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Define your sidebar links here
  const sidebarLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/menu-items", label: "Menu Items" },
    // { href: "/contact", label: "Contact" },
  ];

  return (
    <aside className="border h-screen w-[200px]">
      <ul>
        {sidebarLinks.map((link, index) => (
          <Link href={link.href} key={index + "link"}>
            <li
              key={index}
              className="border p-3 font-semibold hover:bg-slate-900">
              {/* <a className={pathname === link.href ? "active" : ""}> */}
              {link.label}
              {/* </a> */}
            </li>
          </Link>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
