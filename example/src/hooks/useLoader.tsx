import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "@dobuki/asset-loader"

export function useLoader({ urls }: { urls?: string[] }) {
  const loader = useMemo(() => new Loader(), []);
  const [loading, setLoading] = useState(0);
  const reset = useCallback(() => {
    loader.clear();
  }, [loader]);

  useEffect(() => {
    urls?.forEach((u) => {
      setLoading(l => l + 1);
      loader.load(u);
    });

    const listUrls = async() => {
      for await (const u of loader.getAllUrls()) {
        setLoading(l => l - 1);
      }
    };
    listUrls();
  }, [urls, loader, reset]);

  const u = useCallback((url: string) => loader.getUrl(url), [loader]);
  return { u, loading, reset };
}
