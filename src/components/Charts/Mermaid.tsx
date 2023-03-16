/*
 *   Copyright (c) 2023 Duart Snel
 *   All rights reserved.

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

import React, { useEffect, useId, useLayoutEffect, useMemo } from "react";
import mermaid from "mermaid";
import "../../styles/Mermaid.css"

mermaid.initialize({
  startOnLoad: true,
  theme: "base",
  maxTextSize: 999999999999999,
  securityLevel: "antiscript",
  themeVariables: {
    darkMode: true,
    fontSize: "14px",
    primaryColor: "#2b2b2b",
    primaryTextColor: "#f5f5f5",
    secondaryColor: "#ff0000",
  }
});

export default function Mermaid(props: {content: string}) {
    const cid = useId();
    useEffect(() => {
        document.getElementById(cid)!.removeAttribute("data-processed");
        setTimeout(() => {
            mermaid.contentLoaded();
            mermaid.run({
                nodes: [document.getElementById(cid)!],
            })
        }, 1)
    }, [cid, props.content]);
  return <pre id={cid} className="mermaid">{props.content}</pre>;
}