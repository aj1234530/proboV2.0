"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SignedInNavbar({
  balance = "0",
}: {
  balance?: string;
}) {
  const session = useSession();

  return (
    <div className="bg-[#f5f5f5] h-16 border-b-1 border-gray-300  ">
      <div className="h-full flex flex-row justify-between items-center px-10">
        <div className="">
          <Link href="/">
            <img
              className="h-8"
              src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Flogo.webp&w=128&q=75"
            ></img>
          </Link>
        </div>
        {session.status === "authenticated" ? (
          <div className="flex flex-row gap-10 h-full items-center">
            <Link href="/">
              <div className="flex flex-col flex-wrap ">
                <img src="https://d39axbyagw7ipf.cloudfront.net/icons/home.svg"></img>
                <span>Home</span>
              </div>
            </Link>
            <Link href="/portfolio">
              <div className="flex flex-col flex-wrap">
                <img src="https://d39axbyagw7ipf.cloudfront.net/icons/portfolio.svg"></img>
                <span>Portfolio</span>
              </div>
            </Link>
            <Link href="/events">
              <div className="flex flex-col flex-wrap">
                <img src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FBar_Chart.png&w=16&q=75"></img>
                <span>Trade</span>
              </div>
            </Link>
            <Link href="/recharge">
              <div className="flex flex-col flex-wrap">
                <img src="https://d39axbyagw7ipf.cloudfront.net/icons/wallet.svg"></img>
                <span>Recharge</span>
              </div>
            </Link>
            <div className="flex flex-row gap-4 border border-gray-300 px-4 p-0 rounded-sm">
              <img src="https://d39axbyagw7ipf.cloudfront.net/icons/wallet.svg"></img>
              <span>₹{balance}</span>
            </div>
            <img
              src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FSilhouette.png&w=48&q=75"
              className=" h-10 rounded-full"
            ></img>
            <button className="hover:cursor-pointer" onClick={() => signOut()}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-10 h-full items-center">
            <div className="flex flex-col flex-wrap">
              <img src="https://d39axbyagw7ipf.cloudfront.net/icons/home.svg"></img>
              <span>Home</span>
            </div>

            <Link href="/events">
              <div>Trade</div>
            </Link>
            <div className="flex flex-col flex-wrap">
              <Link href="/api/auth/signin">
                <span>Login</span>
              </Link>
            </div>

            <div className="flex flex-row gap-4 border border-gray-300 px-4 p-0 rounded-sm">
              <Link href="/signup">
                <span>Signup</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
