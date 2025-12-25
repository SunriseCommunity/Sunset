"use client";

import type { PaginationState } from "@tanstack/react-table";
import { Search, Settings } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";

import { adminUserColumns } from "@/app/(admin)/admin/users/components/AdminUserColumns";
import { AdminUserDataTable } from "@/app/(admin)/admin/users/components/AdminUserDataTable";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserSearchList } from "@/lib/hooks/api/user/useUserSearchList";
import useDebounce from "@/lib/hooks/useDebounce";
import { tryParseNumber } from "@/lib/utils/type.util";

export const PersonalInfoVisibilityContext = createContext<boolean>(false);

export default function UsersSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const usersQuery = searchParams.get("query") ?? "";
  const usersPage = tryParseNumber(searchParams.get("page")) ?? 0;
  const usersSize = tryParseNumber(searchParams.get("size")) ?? 25;

  const [searchQuery, setSearchQuery] = useState(usersQuery);
  const searchValue = useDebounce<string>(searchQuery, 450);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: usersPage,
    pageSize: usersSize,
  });

  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      }
      else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `${pathname}?${createQueryString("query", searchValue)}`,
    );
  }, [searchValue, pathname, createQueryString]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `${pathname
        }?${
        createQueryString("page", pagination.pageIndex.toString())}`,
    );
  }, [pagination.pageIndex, pathname, createQueryString]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `${pathname}?${createQueryString("size", pagination.pageSize.toString())}`,
    );
  }, [pagination.pageSize, pathname, createQueryString]);

  const { data, isLoading } = useUserSearchList(
    searchValue || undefined,
    pagination.pageIndex + 1,
    pagination.pageSize,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  const users = data?.users || [];
  const totalCount = data?.total_count || 0;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-1 items-center space-x-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users by username, email or ID..."
              className="pl-8"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="relative"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="mr-2 size-4" />
            Settings
            {showPersonalInfo && (
              <div className="absolute -left-2.5 -top-2.5 flex size-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground sm:-left-2 sm:-top-2">
                {[showPersonalInfo].filter(v => v != null).length}
              </div>
            )}
          </Button>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: showSettings ? "500px" : "0" }}
      >
        <div
          className={
            showSettings
              ? "scale-100 opacity-100 transition duration-500"
              : "scale-95 opacity-0 transition duration-300"
          }
        >
          <Card className="p-4">
            <CardContent className="flex items-center space-x-2 p-0">
              <Switch
                id="show-personal-info"
                checked={showPersonalInfo}
                onCheckedChange={setShowPersonalInfo}
              />
              <Label
                htmlFor="show-personal-info"
                className="cursor-pointer capitalize"
              >
                Show personal information by default
              </Label>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && users.length === 0 ? (
          <Card className="p-8">
            <CardContent className="flex items-center justify-center p-0">
              <Spinner />
            </CardContent>
          </Card>
        ) : users.length > 0
          ? (
              <PersonalInfoVisibilityContext value={showPersonalInfo}>
                <AdminUserDataTable
                  columns={adminUserColumns}
                  data={users}
                  pagination={pagination}
                  totalCount={totalCount}
                  setPagination={setPagination}
                />
              </PersonalInfoVisibilityContext>
            )
          : searchValue
            ? (
                <Card className="p-8">
                  <CardContent className="flex flex-col items-center justify-center p-0 text-muted-foreground">
                    <Search className="mb-4 size-12 opacity-50" />
                    <p>No users found matching "{searchValue}"</p>
                  </CardContent>
                </Card>
              )
            : (
                <Card className="p-8">
                  <CardContent className="flex flex-col items-center justify-center p-0 text-muted-foreground">
                    <Search className="mb-4 size-12 opacity-50" />
                    <p>Start typing to search for users</p>
                  </CardContent>
                </Card>
              )}
      </div>
    </div>
  );
}
