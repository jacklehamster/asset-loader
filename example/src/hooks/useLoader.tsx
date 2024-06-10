import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "@dobuki/asset-loader"

export function useLoader({ urls }: { urls?: string[] }) {
  const loader = useMemo(() => new Loader(), []);
  const [loading, setLoading] = useState(0);
  const [lastLoaded, setLastLoaded] = useState<string>()
  const reset = useCallback(() => {
    loader.clear();
  }, [loader]);

  useEffect(() => {
    setLoading(0);
    urls?.forEach((u) => {
      setLoading(l => l + 1);
      loader.load(u).then(() => setLoading(l => l - 1));
    });

    const listUrls = async() => {
      for await (const u of loader.getAllUrls()) {
        setLastLoaded(u?.[0]);
      }
      setLastLoaded(undefined);
    };
    listUrls();
  }, [urls, loader]);

  const pause = useCallback(() => {
    loader.pause();
  }, [loader]);

  const resume = useCallback(() => {
    loader.resume();
  }, [loader]);

  const u = useCallback((url: string) => loader.getUrl(url), [loader]);
  return { u, loading, reset, lastLoaded, pause, resume };
}
