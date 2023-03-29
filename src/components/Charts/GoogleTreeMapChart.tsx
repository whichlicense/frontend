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
import { Chart } from "react-google-charts";
import "../../styles/Chart.css"

type TGoogleTreeMapChartProps = {
  /**
   * The data to be displayed in the chart.
   * ```
   * [
   *     [ 'ID', 'Parent ID', size ],
   *    // ...
   * ]
   */
    data: [string, string | null, number][],
    bg: "bg-section" | "bg-card",
};
export function GoogleTreeMapChart(props: TGoogleTreeMapChartProps) {
  const data = [
    [
      "Item",
      "Parent",
      "Size",
    ],
    ...props.data
  ];

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
  };
  return (
    <Chart
      chartType="TreeMap"
      width="100%"
      height="40vh"
      data={data}
      options={options}
      className={`wl-google-chart ${props.bg}`}
    />
  );
}
