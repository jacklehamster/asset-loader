import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "@dobuki/asset-loader"

export function useLoader({ urls }: { urls?: string[] }) {
  const loader = useMemo(() => new Loader(), []);
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(0);
  useEffect(() => {
    urls?.forEach(async (u) => {
      setLoading(loading => loading + 1);
      const blobUrl = await loader.getUrl(u);
      setLoading(loading => loading - 1);
      setMap(m => ({
        ...m,
        [u]: blobUrl,
      }));
    });
  }, [urls, loader, setMap]);

  const u = useCallback((url: string) => map[url], [map]);
  return { u, loader, loading };
}
