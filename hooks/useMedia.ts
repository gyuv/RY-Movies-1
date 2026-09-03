"use client";

/**
 * Project Apex — useMedia (data hook template)
 * ------------------------------------------------------------------
 * A dependency-free async-resource hook. Components consume domain
 * data through this hook and never see fetch/transport concerns.
 * Drop-in replaceable with SWR/React-Query later without touching UI.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncResource<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refresh: () => void;
}

export function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): AsyncResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const run = useCallback(() => {
    setLoading(true);
    setError(null);
    fetcher()
      .then((d) => mounted.current && setData(d))
      .catch((e) => mounted.current && setError(e as Error))
      .finally(() => mounted.current && setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mounted.current = true;
    run();
    return () => {
      mounted.current = false;
    };
  }, [run]);

  return { data, error, loading, refresh: run };
}
