"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import React from "react";
import LogoutButton from "./LogoutButton";

export default function AuthButtons() {
  const { user } = useUser();

  return (
    <div>
      <div className="flex gap-2">
        {user ? (
          <>
            <span className="flex gap-1 items-center ">
              <span>Bienvenue,</span>
              <Link href="/profile" className=" ">
                {user.name} | {user.role}
              </Link>
            </span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="">
              Login
            </Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
