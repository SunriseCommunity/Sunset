"use client";

import { usePasswordChange } from "@/lib/hooks/api/user/usePasswordChange";
import { useState } from "react";

export default function ChangePasswordInput() {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
  };

  const { trigger } = usePasswordChange();

  const submitChangePasswordForm = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget as HTMLFormElement;

    const currentPassword = form.currentPassword.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      showError("New passwords do not match. Please try again.");
      return;
    }

    if (password.length < 8 || password.length > 32) {
      showError(
        "Invalid new password. Length should be between 8 and 32 characters."
      );
      return;
    }

    trigger(
      {
        current_password: currentPassword,
        new_password: password,
      },
      {
        onSuccess: () => {
          form.reset();
          alert("Password changed successfully!");
        },
        onError: (err) => {
          showError(err.message ?? "Unknown error.");
        },
      }
    );
  };

  return (
    <div className="flex flex-col w-1/2">
      <form className="flex flex-col" onSubmit={submitChangePasswordForm}>
        <label htmlFor="password" className="text-gray-200 text-sm">
          Current password
        </label>
        <input
          type="password"
          placeholder="************"
          name="currentPassword"
          className="bg-terracotta-800 p-2 rounded-lg mb-2"
          maxLength={32}
          required
        />

        <div className="my-1">
          <div className="flex border-b border-gray-700"></div>
        </div>

        <label htmlFor="password" className="text-gray-200 text-sm">
          New Password
        </label>
        <input
          type="password"
          name="password"
          className="bg-terracotta-800 p-2 rounded-lg mb-2"
          maxLength={32}
          required
        />

        <label htmlFor="confirmPassword" className="text-gray-200 text-sm">
          Confirm Password
        </label>
        <input
          type="password"
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
          Change password
        </button>
      </form>
    </div>
  );
}
