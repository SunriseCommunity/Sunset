"use client";

import { getSelf } from "@/lib/actions/getSelf";
import { User } from "@/lib/types/User";
import { useEffect, useRef, useState } from "react";
import { authorize } from "@/lib/actions/authorize";

interface Props {
  dropdownMenuRef: React.RefObject<HTMLElement>;
  setSelf: React.Dispatch<React.SetStateAction<User | null>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderLoginDropdown({
  dropdownMenuRef,
  setSelf,
  isOpen,
  setIsOpen,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    updateVisibilityOfDropdown();

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [isOpen]);

  const updateVisibilityOfDropdown = () => {
    if (!dropdownRef.current) return;
    const dropdown = dropdownRef.current;

    if (isOpen) {
      dropdown.classList.remove("hidden", "opacity-0");
      updateDropdownParent();
      dropdown.classList.add("absolute", "opacity-100");
    } else {
      dropdown.classList.remove("opacity-100");
      dropdown.classList.add("opacity-0");
      setTimeout(() => {
        dropdown.classList.add("hidden");
        dropdown.classList.remove("absolute");
        updateDropdownParent();
      }, 200);
    }
  };

  const updateDropdownParent = () => {
    if (!dropdownRef.current) return;
    const dropdown = dropdownRef.current;

    if (dropdownMenuRef.current?.contains(dropdown)) {
      dropdownMenuRef.current?.removeChild(dropdown);
    } else {
      dropdownMenuRef.current?.appendChild(dropdown);
    }
  };

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

    const isLoggedIn = await authorize(username, password);

    form.reset();

    if (isLoggedIn) {
      getSelf().then((res) => setSelf(res));
      setIsOpen(false);
    } else {
      if (!loginButtonRef.current) return;

      loginButtonRef.current.classList.add("text-red-500");
      loginButtonRef.current.classList.remove("text-white");

      loginButtonRef.current.textContent = "Invalid credentials";
      setTimeout(() => {
        loginButtonRef.current!.classList.remove("text-red-500");
        loginButtonRef.current!.classList.add("text-white");
        loginButtonRef.current!.textContent = "Login";
      }, 4000);
    }
  };

  return (
    <div
      className="hidden bg-stone-800 p-4 space-y-4 smooth-transition opacity-0 ml-auto max-w-[320px]"
      ref={dropdownRef}
    >
      <form
        className="space-y-4 flex flex-col text-black"
        onSubmit={submitLoginForm}
      >
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="rounded-lg text-sm px-2 py-1"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="rounded-lg text-sm px-2 py-1"
        />
        <button
          type="submit"
          className="bg-stone-700 text-white rounded-lg px-4 py-1"
          ref={loginButtonRef}
        >
          Login
        </button>
        <p className="text-sm text-gray-400">
          Looking for the registration page? <br /> Right now you can do it only
          through the osu! client.
          <br /> Sorry for the inconvenience! 🙇‍♂️
        </p>
      </form>
    </div>
  );
}
