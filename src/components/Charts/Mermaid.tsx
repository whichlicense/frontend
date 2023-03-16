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

import React, {
  Suspense,
  useDeferredValue,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import mermaid from "mermaid";
import "../../styles/Mermaid.css";

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
  },
});

export default function Mermaid(props: { content: string }) {
  const cid = useId();
  const svgId = useMemo(() => Date.now().toString(36), []);
  const [svg, setSvg] = useState<string | null>("");
  const defferedSvg = useDeferredValue(svg);

  // prevent blocking the UI on large mermaid renderings
  const [isPending, startTransition] = useTransition();

  const renderSVG = async () => {
    const { svg, bindFunctions } = await mermaid.render(svgId, props.content);
    return svg;
  };

  useEffect(() => {
    renderSVG().then((svg) => {
      console.log(svg);
      startTransition(() => {
        setSvg(svg);
      });
    });

    // document.getElementById(cid)!.removeAttribute("data-processed");
    // setTimeout(() => {
    //     mermaid.contentLoaded();
    //     mermaid.run({
    //         nodes: [document.getElementById(cid)!],
    //     })
    // }, 1)
  }, [props.content]);
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: defferedSvg! }}></div>
    </div>
  );
}
