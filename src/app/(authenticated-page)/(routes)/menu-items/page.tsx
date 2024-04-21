import Link from "next/link";
import React from "react";

type Props = {};

const MenuItems = (props: Props) => {
  return (
    <div>
      <header className="border">
        <ul className="flex gap-6 justify-center">
          <Link href={"/menu-items/categories"}>
            <li>Categories</li>
          </Link>
          <Link href={"/menu-items/items"}>
            <li>Items</li>
          </Link>
        </ul>
      </header>
    </div>
  );
};

export default MenuItems;
