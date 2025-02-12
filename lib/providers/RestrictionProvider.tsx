"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import Image from "next/image";

interface RestrictionContextType {
  setSelfRestricted: (isRestricted: boolean, reason: string) => void;
}

export const RestrictionContext = createContext<
  RestrictionContextType | undefined
>(undefined);

interface RestrictionProviderProps {
  children: ReactNode;
}

const RestrictionModal = ({ reason }: { reason: string }) => {
  return (
    <div className="text-center flex flex-col items-center mt-8 gap-8 row-padding-max-w-2xl">
      <Image
        src="/images/user-not-found.png"
        alt="404"
        width={200}
        height={400}
        className="max-w-fit"
      />

      <h1 className="text-3xl">You are restricted</h1>

      <h2 className="text-lg">
        Hello! If you are seeing this, your account has been restricted. <br />{" "}
        It is possible that you have violated our terms of service.{" "}
      </h2>

      <h2 className="text-lg">
        <br /> If you believe this is a mistake, or want to make an appeal,
        please contact us at{" "}
        <a
          href="https://discordapp.com/users/228223085759692802"
          className="text-blue-400 hover:underline"
        >
          Discord
        </a>
      </h2>

      <div className="mx-auto p-6 bg-stone-800 text-center rounded-lg shadow-lg">
        <p className="text-lg font-semibold mb-4 italic">
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
};

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
    <RestrictionContext.Provider value={{ setSelfRestricted }}>
      {isRestricted && <RestrictionModal reason={reason} />}
      <div>{!isRestricted && children}</div>
    </RestrictionContext.Provider>
  );
};
