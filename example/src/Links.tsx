import React from "react";
import type { TreeItem } from "./hooks/useGitTree";

export function Links({ tree, path, setPath }:{
  tree?: TreeItem[];
  path: string;
  setPath(url: string): void;
}) {
  return <><div>
    {tree?.map((img, index) => {
      const imgPathSplit = img.path.split("/");
      imgPathSplit.pop();
      const imgPathDir = imgPathSplit.join("/");

      if (img.type === "tree" && path === imgPathDir) {
        const path = img.path;
        return <div style={{
            cursor: "pointer",
            textDecoration: "underline",
          }} key={index} onClick={() => {
            setPath(path);
          }}>{path}</div>
      }
    })}
    </div>
</>;
}
