import { useEffect, useState } from "react";
import { Loader } from "@dobuki/asset-loader"

export function useLastLoaded({ loader, urls }: { loader: Loader; urls?: string[] }) {
  const [lastLoaded, setLastLoaded] = useState<string>()

  useEffect(() => {
    const listUrls = async() => {
      for await (const u of loader.getAllUrls()) {
        setLastLoaded(u?.[0]);
      }
      setLastLoaded(undefined);
    };
    listUrls();
  }, [loader, urls]);

  return lastLoaded;
}
