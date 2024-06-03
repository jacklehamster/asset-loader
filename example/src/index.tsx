// To recognize dom types (see https://bun.sh/docs/typescript#dom-types):
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import React from "react";

const div = document.body.appendChild(document.createElement("div"));


const root = createRoot(div);
root.render(location.search.indexOf("strict-mode") >= 0 ?
  <StrictMode>
    <App />
  </StrictMode> : <App />
);
