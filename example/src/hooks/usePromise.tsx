import { useEffect, useState } from "react";

export function usePromise<T>(promise?: Promise<T>): { data: T|undefined } {
  const [data, setData] = useState<T>();
  useEffect(() => {
    setData(undefined);
    promise?.then(value => {
      setData(value);
    });
  }, [promise]);
  return { data: data };
}
