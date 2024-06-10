import { useEffect, useMemo, useState } from "react";
import { URL_REGEX } from "./UrlRegex";
import type { TreeItem } from "./hooks/useGitTree";
import React from "react";
import { ZoomImage } from "./ZoomImage";
import { Picture } from "./Picture";

export function ImageList({ tree, path, u }:{
    path: string;
    tree?: TreeItem[];
    u(url: string|undefined): Promise<string | undefined>;
  }) {
    const [zoomIndex, setZoomIndex] = useState(-1);
    useEffect(() => {
      setZoomIndex(-1);
    }, [path]);
    const images = useMemo(() => {
      return tree?.map((img) => {
        const imgPathSplit = img.path.split("/");
        imgPathSplit.pop();
        const imgPathDir = imgPathSplit.join("/");

        if (img.type === "blob" && path === imgPathDir) {
          const imgPath = img.path;
          const ext = imgPath.split('.').pop()?.toLowerCase();
          if(ext==='jpeg'||ext==='gif'||ext==='jpg'||ext==='png'||ext==='svg') {
            const { author, repo } = URL_REGEX.exec(img.url)?.groups ?? {};
            return author && repo ? `https://${author}.github.io/${repo}/${imgPath}` : undefined;
          }
        }
      }).filter(img => !!img);
    }, [tree, path, u]);
    return <>
      {images?.[zoomIndex] ? <>
        <div>{(zoomIndex+1)} / {images.length}</div>
          <ZoomImage onClose={() => setZoomIndex(-1)} 
            onNext={zoomIndex >= images.length - 1 ? undefined : () => setZoomIndex(index => index + 1)} 
            onPrevious={zoomIndex === 0 ? undefined : () => setZoomIndex(index => index - 1)}
            previousPath={images[zoomIndex - 1]}
            path={images[zoomIndex]}
            nextPath={images[zoomIndex + 1]}
            u={u} />
        </> : 
      <div style={{ display: "flex", flexWrap: "wrap" }}>
          {images?.map((url, index) => 
          <div key={url} style={{
            width: 100, height: 100,
          }}>
            <Picture title={url} url={u(url)} onClick={() => setZoomIndex(index)} />
          </div>
          )}
      </div>}
    </>;
}
