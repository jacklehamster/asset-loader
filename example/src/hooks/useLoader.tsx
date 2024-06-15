import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "@dobuki/asset-loader"
import { useLastLoaded } from "./loader/useLastLoaded";

export function useLoader({ urls }: { urls?: string[] }) {
  const loader = useMemo(() => new Loader({
    maxParallelLoad: 3,
  }), []);
  const [loading, setLoading] = useState(0);

  const reset = useCallback(() => {
    loader.clear();
  }, [loader]);

  useEffect(() => {
    setLoading(0);
    urls?.forEach((u) => {
      setLoading(l => l + 1);
      loader.load(u).then(() => setLoading(l => l - 1));
    });
  }, [loader,urls]);

  const pause = useCallback(() => {
    loader.pause();
  }, [loader]);

  const resume = useCallback(() => {
    loader.resume();
  }, [loader]);

  const u = useCallback((url: string) => loader.getUrl(url), [loader]);
  return { u, loading, reset, lastLoaded: useLastLoaded({ loader, urls }), pause, resume };
}
