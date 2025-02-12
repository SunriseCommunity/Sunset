"use client";

import { useEffect, useRef } from "react";
import { authorize } from "@/lib/actions/authorize";
import useSelf from "@/lib/hooks/useSelf";
import { twMerge } from "tailwind-merge";
import useRestriction from "@/lib/hooks/useRestriction";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderLoginDropdown({ isOpen, setIsOpen }: Props) {
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { revalidate } = useSelf();

  const { setSelfRestricted } = useRestriction();

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [isOpen]);

  const closeDropdown = (e: MouseEvent) => {
    if (
      !dropdownRef.current ||
      (dropdownRef.current as HTMLElement).contains(e.target as Node)
    )
      return;

    setIsOpen(false);
  };

  const submitLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;

    const { isSuccessful, error } = await authorize(username, password);

    form.password.value = "";

    if (isSuccessful) {
      revalidate();
      setIsOpen(false);
    } else {
      if (!loginButtonRef.current) return;

      if (error?.includes("restrict")) {
        setSelfRestricted(true, error);
        return;
      }

      loginButtonRef.current.classList.add("text-red-500");
      loginButtonRef.current.classList.remove("text-white");

      loginButtonRef.current.textContent = error || "Unknown error";
      setTimeout(() => {
        loginButtonRef.current!.classList.remove("text-red-500");
        loginButtonRef.current!.classList.add("text-white");
        loginButtonRef.current!.textContent = "Login";
      }, 4000);
    }
  };

  return (
    <div
      className={twMerge(
        "absolute invisible opacity-0 right-0 mt-4 origin-top-right w-[320px] smooth-transition",
        isOpen ? "visible opacity-100 translate-y-0" : "-translate-y-1/4"
      )}
      ref={dropdownRef}
    >
      <div className="bg-stone-800 rounded-t-md">
        <form
          className="flex flex-col text-black p-4"
          onSubmit={submitLoginForm}
        >
          <h1 className="text-xl text-white mb-2"> Sign In To Proceed</h1>

          <label htmlFor="username" className="text-white text-sm">
            Username
          </label>
          <input
            name="username"
            type="text"
            placeholder="e.g. username"
            className="rounded-lg text-sm px-2 py-1 mb-2"
            maxLength={32}
            required
          />
          <label htmlFor="password" className="text-white text-sm">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="************"
            maxLength={32}
            className="rounded-lg text-sm px-2 py-1 mb-2"
            required
          />
          <button
            type="submit"
            className="bg-stone-700 text-white rounded-lg px-4 py-1"
            ref={loginButtonRef}
          >
            Login
          </button>
        </form>
      </div>
      <div className="bg-stone-900 rounded-b-md shadow-black shadow-lg ">
        <div className="flex flex-col justify-center p-4">
          New to the server?{" "}
          <button
            type="submit"
            className="bg-stone-800 text-white rounded-lg px-4 mt-2 py-1"
            onClick={() => (window.location.href = "/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
