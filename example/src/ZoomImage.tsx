import React from "react";
import { Picture } from "./Picture";

export function ZoomImage({ fullPath: fullPathPromise, onClose, onPrevious, onNext, title }:{
    fullPath: Promise<string|undefined>;
    onClose(): void;
    onPrevious?(): void;
    onNext?(): void;
    title?: string;
  }) {
    return <>
      <button onClick={onPrevious} disabled={!onPrevious}>previous</button>
      <button onClick={onNext} disabled={!onNext}>next</button>
      <div style={{width: 500, height: 500}}>
        <Picture url={fullPathPromise} title={title} onClick={onClose} />
      </div>
    </>;
}
