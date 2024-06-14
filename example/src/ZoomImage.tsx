import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
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
    const [lastDir, setDir] = useState<-1|0|1>(0);
    const previousPathPromise = useMemo(() => previousPath ? u(previousPath) : undefined, [previousPath, u]);
    const fullPathPromise = useMemo(() => u(path), [path, u]);
    const nextPathPromise = useMemo(() => nextPath ? u(nextPath) : undefined, [nextPath, u]);

    useEffect(() => {
      setDir(0);
    }, [previousPath, path, nextPath]);

    const clickBack = useCallback(() => {
      setDir(-1);
      onPrevious?.();
    }, [onPrevious]);

    const clickNext = useCallback(() => {
      setDir(1);
      onNext?.();
    }, [onNext]);

    return <>
      <div style={{ display: "flex" }}>
        <div style={{width: 200, height: 200, border: onPrevious ? "2px solid black" : "2px solid white",
          transition: "all 0.5s",
          marginTop: "100px",
          transform: `perspective(200px) rotateY(60deg) translate3d(0, 0, 0)`,
          }}>
          {previousPathPromise && <Picture url={previousPathPromise} title={"previous"} onClick={clickBack} />}
        </div>
        <div style={{width: 500, height: 500, border: "2px solid black" }}>
          <Picture url={fullPathPromise} title={path} onClick={onClose} />
        </div>
        <div style={{width: 200, height: 200, border: onNext ? "2px solid black" : "2px solid white",
          transition: "all 0.5s",
          marginTop: "100px",
          transform: `perspective(200px) rotateY(-60deg) translate3d(0, 0, 0)` }}>
          {nextPathPromise && <Picture url={nextPathPromise} title={"next"} onClick={clickNext} />}
        </div>
      </div>
    </>;
}
