import React from "react";

export function ZoomImage({ fullPath, onClose, onPrevious, onNext }:{
    fullPath: string;
    onClose(): void;
    onPrevious?(): void;
    onNext?(): void;
  }) {
    return <>
      <button onClick={onClose}>close</button>
      <button onClick={onPrevious} disabled={!onPrevious}>previous</button>
      <button onClick={onNext} disabled={!onNext}>next</button>
      <div>
      <img style={{
          cursor: "pointer",
          width: "500px",
        }} onClick={onClose} title={fullPath} src={fullPath} />
      </div>
    </>;
}
