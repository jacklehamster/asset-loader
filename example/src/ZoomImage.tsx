import React from "react";
import { usePromise } from "./hooks/usePromise";

export function ZoomImage({ fullPath, onClose, onPrevious, onNext }:{
    fullPath: Promise<string|undefined>;
    onClose(): void;
    onPrevious?(): void;
    onNext?(): void;
  }) {
    const { data } = usePromise<string|undefined>(fullPath);
    return <>
      <button onClick={onClose}>close</button>
      <button onClick={onPrevious} disabled={!onPrevious}>previous</button>
      <button onClick={onNext} disabled={!onNext}>next</button>
      <div>
      <img style={{
          cursor: "pointer",
          width: "500px",
        }} onClick={onClose} title={data} src={data} />
      </div>
    </>;
}
