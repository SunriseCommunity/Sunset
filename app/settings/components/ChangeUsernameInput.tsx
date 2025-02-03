"use client";

import { changeUsername } from "@/lib/actions/changeUsername";
import { getSelf } from "@/lib/actions/getSelf";
import { useState } from "react";

export default function ChangeUsernameInput() {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
  };

  const submitChangeUsernameForm = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget as HTMLFormElement;

    const newUsername = form.newUsername.value;

    if (newUsername.length < 2 || newUsername.length > 32) {
      showError(
        "Invalid new username Length should be between 2 and 32 characters."
      );
      return;
    }

    const { isSuccessful, error } = await changeUsername(newUsername);

    if (!isSuccessful) {
      showError(error || "Unknown error.");
      return;
    }

    form.reset();

    alert("Username changed successfully!");

    getSelf().then((user) => {
      if (!user) {
        window.location.href = `/`;
      }
    });
  };

  return (
    <div className="flex flex-col w-1/2">
      <form className="flex flex-col" onSubmit={submitChangeUsernameForm}>
        <label htmlFor="username" className="text-gray-200 text-sm">
          New Username
        </label>
        <input
          type="text"
          name="newUsername"
          className="bg-terracotta-800 p-2 rounded-lg mb-2"
          maxLength={32}
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-terracotta-500 text-white rounded-lg p-2"
        >
          Change Username
        </button>
        <label className="text-xs mt-2">
          * Reminder: Please keep your username family friendly, or it will be
          changed for you. Abusing this feature will result in a ban.
        </label>
      </form>
    </div>
  );
}
