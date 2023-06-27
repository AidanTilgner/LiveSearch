"use client";
import { usePocketBase } from "@/library/hooks/pocketbase";
import pb from "@/library/utils/pocketbase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function Navbar() {
  const pathName = usePathname();

  const isLoginPage = pathName.includes("/login");

  const { isAuthed, logout } = usePocketBase();

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center px-6 py-4 md:py-6 justify-between">
      <Link href="/">
        <h2 className="text-xl md:text-2xl font-black">LiveSearch</h2>
      </Link>
      {!isAuthed && !isLoginPage && (
        <Link href="/login">
          <button className="btn-primary">Login</button>
        </Link>
      )}
      {isAuthed && !isLoginPage && (
        <button
          className="btn-secondary"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;
