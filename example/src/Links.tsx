import React, { useMemo } from "react";
import type { TreeItem } from "./hooks/useGitTree";
import { isImage } from "./utils/ext-utils";

export function Links({ tree, path, setPath }:{
  tree?: TreeItem[];
  path: string;
  setPath(url: string): void;
}) {
  const imagesPerLink = useMemo(() => {
    const imagesPerLink: Record<string, number> = {}
    tree?.forEach((node) => {
      if (node.type === "blob" && isImage(node.path)) {
        const nodePathSplit = node.path.split("/");
        for (let i = 1; i < nodePathSplit.length; i++) {
          const tag = nodePathSplit.slice(0, i).join("/");
          imagesPerLink[tag] = (imagesPerLink[tag] ?? 0) + 1;
        }
      }
    });

    return imagesPerLink;
  }, [tree]);
  console.log(imagesPerLink);

  return <><div>
    {tree?.map((node, index) => {
      const nodePathSplit = node.path.split("/");
      nodePathSplit.pop();
      const nodePathDir = nodePathSplit.join("/");

      if (node.type === "tree" && path === nodePathDir && imagesPerLink[node.path]) {
        const path = node.path;
        return <div style={{
            cursor: "pointer",
            textDecoration: "underline",
          }} key={index} onClick={() => {
            setPath(path);
          }}>{path} ({imagesPerLink[path]})</div>
      }
    })}
    </div>
</>;
}
