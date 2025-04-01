"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import RoundedContent from "../General/RoundedContent";
import { twMerge } from "tailwind-merge";
import UserRowElement from "../UserRowElement";
import useDebounce from "@/lib/hooks/useDebounce";
import Spinner from "../Spinner";
import { useUserSearch } from "@/lib/hooks/api/user/useUserSearch";

interface Props {
  isHovered: boolean;
}

export default function HeaderSearchPopup({ isHovered }: Props) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const searchValue = useDebounce<string | null>(searchQuery, 450);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const userSearchQuery = useUserSearch(searchValue, 1, 5);
  const userSearch = userSearchQuery.data;

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [isSearchOpen]);

  const closeDropdown = (e: MouseEvent) => {
    if ((searchRef.current as HTMLElement)?.contains(e.target as Node)) return;

    setIsSearchOpen(false);
  };

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery(null);
    }
  };

  return (
    <>
      <Search
        className={`hover:bg-neutral-600 hover:bg-opacity-25 p-1 h-7 w-7 rounded-md cursor-pointer smooth-transition ${
          !isHovered ? "opacity-40" : ""
        }`}
        onClick={() => toggleSearch()}
      />

      {isSearchOpen &&
        ReactDOM.createPortal(
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 flex-col">
            <div
              className="max-w-md md:max-w-lg 2xl:max-w-2xl w-full"
              ref={searchRef}
            >
              <div
                className={twMerge(
                  "bg-coffee-600 pb-4 pt-2 px-4 relative",
                  userSearch
                    ? "rounded-t-lg"
                    : "rounded-lg shadow-black shadow-lg"
                )}
              >
                <div className="relative w-full">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-between w-full relative">
                      {userSearchQuery.isLoading ? (
                        <Spinner />
                      ) : (
                        <Search className="h-6 w-6 text-gray-400" />
                      )}

                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Type to search..."
                        className="w-full px-4 py-2 text-xl  bg-coffee-600  rounded-md focus:outline-none"
                        value={searchQuery ?? ""}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-400"></span>
                  </div>
                </div>
              </div>
              {userSearch && (
                <RoundedContent className="shadow-black shadow-lg">
                  {userSearch.length === 0 && !userSearchQuery.isLoading && (
                    <div className="flex items-center justify-center h-12">
                      <p className="text-gray-400">No results found.</p>
                    </div>
                  )}

                  <ul className="space-y-2">
                    {userSearch?.map((result, index) => (
                      <UserRowElement user={result} key={index} />
                    ))}
                  </ul>
                </RoundedContent>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
