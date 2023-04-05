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
import { Chart, ReactGoogleChartEvent } from "react-google-charts";
import "../../styles/Chart.css";
import { useElementSize } from "../Hooks/useElementSize";
import { useEffectOnce } from "../utils/useEffectOnce";

type TGoogleTreeMapChartProps = {
  /**
   * The data to be displayed in the chart.
   * ```
   * [
   *     [ 'ID', 'Parent ID', size ],
   *    // ...
   * ]
   */
  data: [string, string | null, number][];
  bg: "bg-section" | "bg-card";
  resizableContainerId?: string;
  maxDepth?: number;
  maxPostDepth?: number;
};
export function GoogleTreeMapChart(props: TGoogleTreeMapChartProps) {
  const data = [["Item", "Parent", "Size"], ...props.data];
  // Forces a re-render (and thus resize) when the supplied element is resized.
  useElementSize({ id: props.resizableContainerId || "root", debounce: 5 });
  const uid = (Math.random().toString(36) + Date.now().toString(36)).substring(
    2
  );

  const options: Chart["props"]["options"] = {
    noColor: "#818b8e",
    minColor: "#9b7bf5",
    midColor: "#eed256",
    maxColor: "#f67676",
    headerHeight: 0, // removes the grey top header
    fontColor: "#1e1e1e",
    fontFamily: "DMMono",
    fontSize: 20,
    showScale: false,
    enableHighlight: true,
    useWeightedAverageForAggregation: true,

    maxDepth: props.maxDepth || 1,
    maxPostDepth: props.maxPostDepth || 0,
  };

  return (
    <div
      className="position-relative w-100"
      style={{
        height: "40vh",
      }}
    >
      <div className="position-absolute w-100" id={uid}>
        <Chart
          chartType="TreeMap"
          width={`100%`}
          height="40vh"
          data={data}
          options={options}
          className={`wl-google-chart ${
            navigator.userAgent.includes("Safari") ? "" : "not-safari"
          } ${props.bg}`}
          onLoad={() => {
            // I can't believe I have to do this...
            if (navigator.userAgent.includes("Safari")) {
              // I hate safari.
              setTimeout(() => {
                const x = document.getElementById(uid);
                if (!x) return;
                const res = x!.querySelectorAll("rect");

                for (const element of res.values()) {
                  element.setAttribute("rx", "12px");
                  element.setAttribute("ry", "12px");
                }
              }, 400);
            }
          }}
        />
      </div>
    </div>
  );
}
