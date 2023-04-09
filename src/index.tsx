/*
 *   Copyright (c) 2023 Duart Snel


 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ETelemetryEntryType, Telemetry } from "./components/utils/Telemetry";

const telemetry = Telemetry.instance;
document.addEventListener("visibilitychange", () => {
  console.log("Visibility changed", window.location);
  if (document.hidden) {
    telemetry.addEntry({
      type: ETelemetryEntryType.PAGE_BLUR,
      title: "Page blur",
    })
  } else {
    telemetry.addEntry({
      type: ETelemetryEntryType.PAGE_FOCUS,
      title: "Page focus",
    })
  }
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
