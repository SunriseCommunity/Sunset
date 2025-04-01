"use client";
import { User } from "@/lib/hooks/api/user/types";
import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import { createContext, ReactNode } from "react";

interface SelfContextType {
  self: User | undefined;
  isLoading: boolean;
  revalidate: () => void;
}

export const SelfContext = createContext<SelfContextType | undefined>(
  undefined
);

interface SelfProviderProps {
  children: ReactNode;
}

export const SelfProvider: React.FC<SelfProviderProps> = ({ children }) => {
  const selfUserQuery = useUserSelf();

  const { data, isLoading } = selfUserQuery;

  return (
    <SelfContext.Provider
      value={{ self: data, isLoading, revalidate: selfUserQuery.mutate }}
    >
      {children}
    </SelfContext.Provider>
  );
};
