import React from "react";
import { usePromise } from "./hooks/usePromise";

interface Props {
  url?: Promise<string|undefined>;
  onClick?: () => void;
}

export function ImageThumbnail({ url, onClick }: Props) {
  const { data } = usePromise<string | undefined>(url);

  return data && <div 
    style={{
      width: 100, height: 100,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",    
      cursor: "pointer",
      backgroundImage: `url('${data}')`
    }}
    onClick={onClick}
    >
  </div>;

}
