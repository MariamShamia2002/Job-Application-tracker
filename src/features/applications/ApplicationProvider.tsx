import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  ApplicationSource,
  ApplicationsFilters,
  ApplicationStatus,
  Priority,
} from "@/api/types";
import {
  ApplicationListContext,
  type SortDir,
  type SortField,
} from "./ApplicationContext";

const SEARCH_DEBOUNCE_MS = 300;

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");
  const [source, setSource] = useState<ApplicationSource | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [archived, setArchived] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [search]);

  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((dir) => (dir === "desc" ? "asc" : "desc"));
        return;
      }
      setSortField(field);
      setSortDir("desc");
    },
    [sortField],
  );

  const clear = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("all");
    setSource("all");
    setPriority("all");
    setArchived(false);
    setSortField(null);
    setSortDir("desc");
  }, []);

  const apiFilters = useMemo<ApplicationsFilters>(() => {
    const filters: ApplicationsFilters = { archived };

    const trimmed = debouncedSearch.trim();
    if (trimmed) filters.search = trimmed;
    if (status !== "all") filters.status = status;
    if (source !== "all") filters.source = source;
    if (priority !== "all") filters.priority = priority;
    if (sortField) filters.sort = `${sortField}:${sortDir}`;

    return filters;
  }, [archived, debouncedSearch, priority, sortDir, sortField, source, status]);

  const value = useMemo(
    () => ({
      search,
      status,
      source,
      priority,
      archived,
      sortField,
      sortDir,
      apiFilters,
      setSearch,
      setStatus,
      setSource,
      setPriority,
      setArchived,
      toggleSort,
      clear,
    }),
    [
      apiFilters,
      archived,
      clear,
      priority,
      search,
      sortDir,
      sortField,
      source,
      status,
      toggleSort,
    ],
  );

  return (
    <ApplicationListContext.Provider value={value}>
      {children}
    </ApplicationListContext.Provider>
  );
}
