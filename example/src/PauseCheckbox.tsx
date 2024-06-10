import React, { useId } from "react";

export function PauseCheckbox({ pause, resume }: { pause: () => void; resume: () => void }) {
  const id = useId();
  return <>
  <label htmlFor={id}>Pause loader:</label>
  <input id={id} type="checkbox" onChange={(e) => {
    if (e.target.checked) {
      pause();
    } else {
      resume();
    };
  }}></input>
  </>;
}
