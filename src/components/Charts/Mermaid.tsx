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

import {
  Suspense,
  useDeferredValue,
  useMemo,
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

const wrapPromise = (promise: Promise<string>) => {
  let status = "pending";
  let result: string;
  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
}
const renderSVG = async (svgId: string, mermaidCode: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { svg, bindFunctions } = await mermaid.render(svgId, mermaidCode);
  return svg;
};

export default function Mermaid(props: { content: string }) {
  const svgId = useMemo(() => Date.now().toString(36), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const svg = useMemo(()=>wrapPromise(renderSVG(svgId, props.content)), [props.content]);
  /**
   * any user-given input could trigger an expensive operation. for this reason, we use useDeferredValue to
   * use old data (graph) until the new one is available for printing.
   * This gives the illusion that things are faster than they actually are.
   * */
  const defferedSvg = useDeferredValue(svg);

  const Graph = () => {
    const t = defferedSvg.read();
    return (
      <div dangerouslySetInnerHTML={{ __html: t || "" }}></div>
    )
  }
  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <Graph />
    </Suspense>
  );
}
