"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import useDebounce from "@/lib/hooks/useDebounce";
import { UserSensitiveResponse, UserEventType } from "@/lib/types/api";
import { useUserEvents } from "@/lib/hooks/api/user/useAdminUserEdit";
import { AdminUserEventsDataTable } from "../../../../components/AdminUserEventsDataTable";
import { adminUserEventsColumns } from "../../../../components/AdminUserEventsColumns";
import { AdminUserEventsFilters } from "../../../../components/AdminUserEventsFilters";
import Spinner from "@/components/Spinner";
import { PaginationState } from "@tanstack/react-table";
import { usePathname, useSearchParams } from "next/navigation";
import { tryParseNumber } from "@/lib/utils/type.util";

export default function AdminUserEditEvents({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const eventsQuery = searchParams.get("events_query") ?? "";
  const eventsPage = tryParseNumber(searchParams.get("events_page")) ?? 0;
  const eventsSize = tryParseNumber(searchParams.get("events_size")) ?? 25;
  const eventsTypes = searchParams.get("events_types");

  const [searchQuery, setSearchQuery] = useState(eventsQuery);
  const searchValue = useDebounce<string>(searchQuery, 450);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: eventsPage,
    pageSize: eventsSize,
  });

  const [eventTypesFilter, setEventTypesFilter] = useState<
    UserEventType[] | null
  >(
    eventsTypes
      ? (eventsTypes.split(",").filter(Boolean) as UserEventType[])
      : null
  );
  const [showFilters, setShowFilters] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    params.set("events_query", searchValue);
    params.set("events_page", pagination.pageIndex.toString());
    params.set("events_size", pagination.pageSize.toString());
    params.set(
      "events_types",
      eventTypesFilter ? eventTypesFilter.join(",") : ""
    );

    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }, [
    searchValue,
    pagination.pageIndex,
    pagination.pageSize,
    eventTypesFilter,
    pathname,
  ]);
  const { data, isLoading } = useUserEvents(
    user.user_id,
    searchValue || null,
    pagination.pageIndex + 1,
    pagination.pageSize,
    eventTypesFilter ?? undefined,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const events = data?.events || [];
  const totalCount = data?.total_count || 0;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const applyFilters = (filters: { eventTypes: UserEventType[] | null }) => {
    setEventTypesFilter(filters.eventTypes);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-1 items-center space-x-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="relative"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {eventTypesFilter != null && (
              <div className="absolute bg-primary sm:-top-2 text-primary-foreground -top-2.5 sm:-left-2 -left-2.5 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {[eventTypesFilter].filter((v) => v != null).length}
              </div>
            )}
          </Button>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: showFilters ? "500px" : "0" }}
      >
        <div
          className={
            showFilters
              ? "opacity-100 scale-100 transition duration-500"
              : "opacity-0 scale-95 transition duration-300"
          }
        >
          <AdminUserEventsFilters
            onApplyFilters={applyFilters}
            isLoading={isLoading}
            defaultEventTypes={eventTypesFilter}
          />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && events.length === 0 ? (
          <Card className="p-8">
            <CardContent className="flex items-center justify-center p-0">
              <Spinner />
            </CardContent>
          </Card>
        ) : events.length > 0 ? (
          <AdminUserEventsDataTable
            columns={adminUserEventsColumns}
            data={events}
            pagination={pagination}
            totalCount={totalCount}
            setPagination={setPagination}
          />
        ) : searchValue || eventTypesFilter ? (
          <Card className="p-8">
            <CardContent className="flex flex-col items-center justify-center p-0 text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-50" />
              <p>
                No events found
                {searchValue && ` matching "${searchValue}"`}
                {eventTypesFilter && " with selected filters"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-8">
            <CardContent className="flex flex-col items-center justify-center p-0 text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-50" />
              <p>No events found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
