import { useCallback, useEffect, useState } from "react";

const REPO_API = "https://api.github.com/repos/";

export interface TreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size: number;
  url: string;
}

export function useGitTree({ author, name }: { author?: string; name?: string }) {
  const [tree, setTree] = useState<TreeItem[]>();
  const [fetching, setFetching] = useState(false);
  const fetchTree = useCallback(async () => {
    setFetching(true);
    if (author && name) {
      const tree_sha = await fetch(`${REPO_API}${author}/${name}/branches/master`)
      .then(response => response.json())
      .then(json => json.commit.sha);
    const tree = await fetch(`${REPO_API}${author}/${name}/git/trees/${tree_sha}?recursive=true`)
      .then(response => response.json())
      .then(json => json.tree);
      setFetching(false);
    return tree;
    }
  }, [author, name]);  

  useEffect(() => {
    fetchTree().then(setTree);
  }, [author, name]);

  return { tree: !fetching ? tree : undefined };
}
