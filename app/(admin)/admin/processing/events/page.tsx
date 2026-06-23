"use client";

import { Filter, ScrollText } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import PrettyDate from "@/components/General/PrettyDate";
import PrettyHeader from "@/components/General/PrettyHeader";
import { SmallUserElement } from "@/components/SmallUserElement";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { useScoreProcessingEvents } from "@/lib/hooks/api/score-processing/useScoreProcessingEvents";
import { ScoreProcessingEventType } from "@/lib/types/api";

const PAGE_SIZE = 25;

export default function Page() {
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  const { data, isLoading } = useScoreProcessingEvents(
    useMemo(() => ({ types: eventTypes, page, limit: PAGE_SIZE }), [eventTypes, page]),
    { refreshInterval: 0, revalidateOnFocus: false, keepPreviousData: true },
  );

  const events = data?.events ?? [];
  const totalCount = data?.total_count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader text="Processing events" roundBottom icon={<ScrollText />} />

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {totalCount}
          {" "}
          event(s)
        </p>
        <Button type="button" variant="outline" className="relative" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 size-4" />
          Filters
          {eventTypes.length > 0 && (
            <div className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {eventTypes.length}
            </div>
          )}
        </Button>
      </div>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: showFilters ? "300px" : "0" }}
      >
        <Card>
          <CardContent className="space-y-2 p-4">
            <label className="text-sm font-medium">Event type</label>
            <MultiSelect
              options={Object.values(ScoreProcessingEventType).map(option => ({
                value: option,
                label: option,
              }))}
              defaultValue={eventTypes}
              placeholder="All event types"
              onValueChange={(values) => {
                setEventTypes(values);
                setPage(1);
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        {isLoading && events.length === 0
          ? (
              <Card className="p-8">
                <CardContent className="flex items-center justify-center p-0">
                  <Spinner />
                </CardContent>
              </Card>
            )
          : events.length > 0
            ? (
                events.map(event => (
                  <Card key={event.id}>
                    <CardContent className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{event.event_type}</Badge>
                          {event.executor
                            ? (
                                <SmallUserElement avatarUrl={event.executor.avatar_url} username={event.executor.username} profileUrl={`/admin/users/${event.executor.user_id}/edit`} />
                              )
                            : <Badge className="bg-muted text-muted-foreground">Server</Badge>}
                          {event.score_id != null && (
                            <Link
                              href={`/admin/scores/${event.score_id}`}
                              className="text-sm text-muted-foreground hover:underline"
                            >
                              {`Score #${event.score_id}`}
                            </Link>
                          )}
                          {event.task_id != null && (
                            <span className="text-sm text-muted-foreground">
                              {`Task #${event.task_id}`}
                            </span>
                          )}
                        </div>
                        {event.json_data && (
                          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all rounded bg-muted/40 p-2 text-xs text-muted-foreground">
                            {event.json_data}
                          </pre>
                        )}
                      </div>
                      <PrettyDate className="text-sm text-muted-foreground" time={event.created_at} />
                    </CardContent>
                  </Card>
                ))
              )
            : (
                <Card className="p-8">
                  <CardContent className="flex flex-col items-center justify-center p-0 text-muted-foreground">
                    <ScrollText className="mb-4 size-12 opacity-50" />
                    <p>No processing events found.</p>
                  </CardContent>
                </Card>
              )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          {`Page ${page} of ${totalPages}`}
        </span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
