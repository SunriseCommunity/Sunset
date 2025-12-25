"use client";

import type { ReactNode } from "react";
import { createContext } from "react";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import type { UserResponse } from "@/lib/types/api";

interface SelfContextType {
  self: UserResponse | undefined;
  isLoading: boolean;
  revalidate: () => void;
}

export const SelfContext = createContext<SelfContextType | undefined>(
  undefined,
);

interface SelfProviderProps {
  children: ReactNode;
}

export const SelfProvider: React.FC<SelfProviderProps> = ({ children }) => {
  const selfUserQuery = useUserSelf();

  const { data, isLoading } = selfUserQuery;

  return (
    <SelfContext
      value={{ self: data, isLoading, revalidate: selfUserQuery.mutate }}
    >
      {children}
    </SelfContext>
  );
};
