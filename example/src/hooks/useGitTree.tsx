import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [errorMessage, setErrorMessage] = useState<string>();
  const [docUrl, setDocUrl] = useState<string>();
  const [tree_sha, setTreeSha] = useState<string>();
  const fetchTree = useCallback(async () => {
    setFetching(true);
    if (author && name) {
      await fetch(`${REPO_API}${author}/${name}/branches/master`, {

      })
      .then(response => response.json())
      .then(json => {
        setTreeSha(json.commit?.sha);
        setErrorMessage(json.message);
        setDocUrl(json.documentation_url);
      })
      .catch(e => {
        setErrorMessage(e.message);
      });
    }
  }, [author, name]);

  useEffect(() => {
    if (!tree_sha?.length) {
      return;
    }
    fetch(`${REPO_API}${author}/${name}/git/trees/${tree_sha}?recursive=true`, {
        
    })
      .then(response => response.json())
      .then(json => {
        setTree(json.tree);
        setErrorMessage(json.message);
        setDocUrl(json.documentation_url);
        setFetching(false);
      })
      .catch(e => {
        setErrorMessage(e.message);
        setFetching(false);
      });
  }, [tree_sha]);

  useEffect(() => {
    fetchTree();
  }, [author, name]);

  return { tree: !fetching ? tree : undefined, error: useMemo(() => <a href={docUrl}>{errorMessage}</a>, [errorMessage, docUrl]) };
}
