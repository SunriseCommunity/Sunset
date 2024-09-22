"use client";
import { getSelf } from "@/lib/actions/getSelf";
import { User } from "@/lib/types/User";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

interface SelfContextType {
  self: User | null;
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
  const [self, setSelf] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSelf = useCallback(() => {
    setIsLoading(true);

    getSelf().then((user) => {
      setSelf(user);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (self === null) {
      fetchSelf();
    }
  }, [self, fetchSelf]);

  const revalidate = useCallback(() => {
    fetchSelf();
  }, [fetchSelf]);

  return (
    <SelfContext.Provider value={{ self, isLoading, revalidate }}>
      {children}
    </SelfContext.Provider>
  );
};
