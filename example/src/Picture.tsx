import React from "react";
import { usePromise } from "./hooks/usePromise";

interface Props {
  title?: string;
  url?: Promise<string|undefined>;
  onClick?: () => void;
}

export function Picture({ title, url, onClick }: Props) {
  const { data: imgUrl } = usePromise<string | undefined>(url);

  return imgUrl && <div className="container"
    style={{
      cursor: onClick ? "pointer" : undefined,
    }}
    onClick={onClick}>
      <img title={title} src={imgUrl} />
  </div>;

}
