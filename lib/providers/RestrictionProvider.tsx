"use client";
import Image from "next/image";
import type { ReactNode } from "react";
import { createContext, useState } from "react";

interface RestrictionContextType {
  setSelfRestricted: (isRestricted: boolean, reason: string) => void;
}

export const RestrictionContext = createContext<
  RestrictionContextType | undefined
>(undefined);

interface RestrictionProviderProps {
  children: ReactNode;
}

function RestrictionModal({ reason }: { reason: string }) {
  return (
    <div className="row-padding-max-w-2xl mt-8 flex flex-col items-center gap-8 text-center">
      <Image
        src="/images/user-not-found.png"
        alt="404"
        width={200}
        height={400}
        className="max-w-fit"
      />

      <h1 className="text-3xl">You are restricted</h1>

      <h2 className="text-lg">
        Hello! If you are seeing this, your account has been restricted.
        {" "}
        <br />
        {" "}
        It is possible that you have violated our terms of service.
        {" "}
      </h2>

      <h2 className="text-lg">
        <br />
        {" "}
        If you believe this is a mistake, or want to make an appeal,
        please contact us
        {process.env.NEXT_PUBLIC_DISCORD_LINK ? (
          <span>
            {" "}
            at
            {" "}
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_LINK}
              className="text-blue-400 hover:underline"
            >
              Discord
            </a>
          </span>
        ) : (
          "."
        )}
      </h2>

      <div className="mx-auto rounded-lg bg-stone-800 p-6 text-center shadow-lg">
        <p className="mb-4 text-lg font-semibold italic">
          "Actions have consequences, and understanding the impact of our
          choices is the first step toward growth. Restrictions are not
          punishment, but an opportunity to reflect and improve."
        </p>
        <p className="text-sm text-gray-200">– Reflect and grow</p>
      </div>

      <p className="text-xl">
        <strong>Provided reason for restriction:</strong>
        <br />
        <span className="text-sm">{reason}</span>
      </p>
    </div>
  );
}

export const RestrictionProvider: React.FC<RestrictionProviderProps> = ({
  children,
}) => {
  const [isRestricted, setIsRestricted] = useState(false);

  const [reason, setReason] = useState("");

  const setSelfRestricted = (isRestricted: boolean, reason: string) => {
    setIsRestricted(isRestricted);
    setReason(reason);
  };

  return (
    <RestrictionContext value={{ setSelfRestricted }}>
      {isRestricted && <RestrictionModal reason={reason} />}
      {!isRestricted && children}
    </RestrictionContext>
  );
};
