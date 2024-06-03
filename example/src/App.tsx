import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ImageList } from './ImageList';
import { useGitTree } from './hooks/useGitTree';
import { useLoader } from "./hooks/useLoader";
import { URL_REGEX } from './UrlRegex';
import { Links } from './Links';
import styles from './App.module.css';
import React from 'react';
import { isImage } from './utils/ext-utils';

export const GIT_API_URL = 'https://api.github.com/repos';

export default function App() {
  const [repo, setRepo] = useState<{ name: string; author: string }>({
    name: "art",
    author: "jacklehamster",
  });
  const [path, setPath] = useState("");  
  const authorId = useId();
  const repoId = useId();

  const { tree } = useGitTree(repo);

  const images = useMemo(() => {
    return tree
      ?.filter(t => t.type === "blob")
      .filter(t => isImage(t.path))
      .map(t => {
        const { author, repo } = URL_REGEX.exec(t.url)?.groups ?? {};
        return [t.path, author, repo];
      })
      .filter(([path, author, repo]) => path && author && repo)
      .map(([path, author, repo]) => `https://${author}.github.io/${repo}/${path}`);
  }, [tree, repo]);

  const { u, loading } = useLoader({ urls: images });

  const authorRef = useRef<HTMLInputElement>(null);
  const repoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authorRef.current && repoRef.current) {
      authorRef.current.value = "jacklehamster";
      repoRef.current.value = "art";
    }
  }, [authorRef, repoRef]);

  return <><>
  <div>
    This is a demo that uses
    <a rel='noopener' href="https://www.npmjs.com/package/@dobuki/asset-loader" target='_blank'> @dobuki/asset-loader </a> 
    in order to progressively load all images from a Github repository in one batch.
    Once the images are loaded, they are kept in memory to avoid further access to the server.

    Note: The repo you use must have public Github pages exposed to "root".
    We avoid using the Github API to open images, to avoid hitting API request limit.

    Enter the Github author and repo name below.
  </div>
  <p></p>
  <div>
    <label htmlFor={authorId}>Author</label>
    <input ref={authorRef} id={authorId} type="text" />
  </div>
  <div>
    <label htmlFor={repoId}>Repo</label>
    <input ref={repoRef} id={repoId} type="text" />
  </div>
  <div>
    <button className={styles.black} type="button" onClick={() => {
      const author = authorRef.current?.value;
      const repo = repoRef.current?.value;
      if (author && repo) {
        setRepo({
          name: repo,
          author: author,
        })
        setPath("");
      }
    }}>explore</button>
  </div>
  </>
    <div style={{ backgroundColor: "yellow", height: 20 }}>
      {<span onClick={() => setPath("")} style={{ fontWeight: "bold", marginRight: 10, cursor: "pointer" }}>{repo.author}/{repo.name}</span>}
      {path.split("/").map((part, index) =>
        <span key={index}>
          /<a style={{
            textDecoration: "underline",
            cursor: "pointer",
          }} onClick={() => {
            const p = path.split("/").slice(0, index + 1).join("/");
            setPath(p);
          }}>{part}</a>
        </span>
      )}
    </div>
    <>{path.length ? <div><button type="button" onClick={() => {
            setPath(path => {
              const split = path.split("/");
              split.pop();
              return split.join("/");    
            });
          }}>Back</button></div> : undefined }</>
    {tree ? 
      <>
        <ImageList tree={tree} path={path} u={u} />
        <Links tree={tree} path={path} setPath={setPath} />
      </> : "..."
    }
    <>{loading ? <div>Loading images ({loading})...</div> : undefined}</>
  </>;
}
