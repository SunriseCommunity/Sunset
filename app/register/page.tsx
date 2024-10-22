"use client";
import { DoorOpen } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Image from "next/image";
import { useState } from "react";
import { register } from "@/lib/actions/register";
import { getSelf } from "@/lib/actions/getSelf";

export default function Register() {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
  };

  const submitRegisterForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget as HTMLFormElement;

    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      showError("Passwords do not match. Please try again.");
      return;
    }

    if (username.length < 2 || username.length > 32) {
      showError(
        "Invalid username. Length should be between 2 and 32 characters."
      );
      return;
    }

    if (password.length < 8 || password.length > 32) {
      showError(
        "Invalid password. Length should be between 8 and 32 characters."
      );
      return;
    }

    const { isSuccessful, error } = await register(username, password, email);

    if (!isSuccessful) {
      showError(error || "Unknown error.");
      return;
    }

    getSelf().then((user) => {
      if (user) {
        window.location.href = `/user/${user.user_id}`;
      }
    });
  };

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader
        text="Register"
        icon={<DoorOpen />}
        className="bg-terracotta-700 mb-4"
        roundBottom={true}
      />
      <RoundedContent className="mb-4 bg-terracotta-700 rounded-lg">
        <div className="flex w-11/12 mx-auto">
          <div className="flex flex-col w-11/12 mx-auto space-y-2">
            <h1 className="text-xl pt-6">Welcome to the registration page!</h1>
            <p className="text-gray-200 ">
              Hello! Please enter your details to create an account. If you
              don't sure how to connect to the server, or if you have any other
              questions, please visit our wiki page.
            </p>

            <div className="flex flex-col space-y-2 pt-6">
              <h1 className="text-xl">Enter your details</h1>
              <form className="flex flex-col" onSubmit={submitRegisterForm}>
                <label htmlFor="username" className="text-gray-200 text-sm">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. username"
                  name="username"
                  className="bg-terracotta-800 p-2 rounded-lg mb-2"
                  pattern="^[a-zA-Z0-9_]{1,32}$"
                  maxLength={32}
                  required
                />
                <label htmlFor="email" className="text-gray-200 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. username@mail.com"
                  name="email"
                  pattern="^.+@.+\.[a-zA-Z]{2,63}$"
                  required
                  className="bg-terracotta-800 p-2 rounded-lg mb-2"
                  maxLength={256}
                />

                <label htmlFor="password" className="text-gray-200 text-sm">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="************"
                  name="password"
                  className="bg-terracotta-800 p-2 rounded-lg mb-2"
                  maxLength={32}
                  required
                />

                <label
                  htmlFor="confirmPassword"
                  className="text-gray-200 text-sm"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="************"
                  name="confirmPassword"
                  className="bg-terracotta-800 p-2 rounded-lg mb-2"
                  maxLength={32}
                  required
                />

                {error && <p className="text-red-500">{error}</p>}

                <button
                  type="submit"
                  className="bg-terracotta-500 text-white rounded-lg p-2"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
          <Image
            src="/images/register.png"
            alt="register image"
            width={400}
            height={800}
            className="rounded-lg mt-4"
          />
        </div>
      </RoundedContent>
    </div>
  );
}
