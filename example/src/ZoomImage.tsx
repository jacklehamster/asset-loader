import React, { useEffect, useMemo } from "react";
import { Picture } from "./Picture";

export function ZoomImage({ previousPath, path, nextPath, u, onClose, onPrevious, onNext }:{
    previousPath?: string;
    path: string;
    nextPath?: string;
    u(str: string): Promise<string|undefined>;
    onClose(): void;
    onPrevious?(): void;
    onNext?(): void;
  }) {
    const previousPathPromise = useMemo(() => previousPath ? u(previousPath) : undefined, [previousPath, u]);
    const fullPathPromise = useMemo(() => u(path), [path, u]);
    const nextPathPromise = useMemo(() => nextPath ? u(nextPath) : undefined, [nextPath, u]);

    useEffect(() => {

    }, [previousPath]);

    return <>
      <button onClick={onPrevious} disabled={!onPrevious}>previous</button>
      <button onClick={onNext} disabled={!onNext}>next</button>
      <div style={{ display: "flex" }}>
        {/* rotateY(0deg) translate(300px, 150px) scale(2.5, 2.5) */}
        <div style={{width: 200, height: 200, border: onPrevious ? "2px solid black" : "2px solid white",
          transition: "all 0.5s",
          marginTop: "100px",
          transform: "perspective(200px) rotateY(80deg) scale(1, 1)"}}>
          {previousPathPromise && <Picture url={previousPathPromise} title={"previous"} onClick={onPrevious} />}
        </div>
        <div style={{width: 500, height: 500, border: "2px solid black" }}>
          <Picture url={fullPathPromise} title={path} onClick={onClose} />
        </div>
        <div style={{width: 200, height: 200, border: onNext ? "2px solid black" : "2px solid white",
          transition: "all 0.5s",
          marginTop: "100px",
          transform: "perspective(200px) rotateY(-80deg) scale(1, 1)" }}>
          {nextPathPromise && <Picture url={nextPathPromise} title={"next"} onClick={onNext} />}
        </div>
      </div>
    </>;
}
