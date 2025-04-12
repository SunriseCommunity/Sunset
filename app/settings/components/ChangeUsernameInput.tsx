"use client";

import { useUsernameChange } from "@/lib/hooks/api/user/useUsernameChange";
import { useState } from "react";

export default function ChangeUsernameInput() {
  const [error, setError] = useState<string | null>(null);

  const { trigger } = useUsernameChange();

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

    trigger(
      {
        new_username: newUsername,
      },
      {
        onSuccess: () => {
          form.reset();
          alert("Username changed successfully!");
        },
        onError: (err) => {
          showError(err.message ?? "Unknown error.");
        },
      }
    );
  };

  return (
    <div className="flex flex-col lg:w-1/2">
      <form className="flex flex-col" onSubmit={submitChangeUsernameForm}>
        <label htmlFor="username" className="text-gray-200 text-sm">
          New Username
        </label>
        <input
          type="text"
          name="newUsername"
          className="bg-terracotta-800 p-2 rounded-lg mb-2"
          maxLength={32}
          pattern="^[a-zA-Z0-9_\- ]{1,32}$"
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
