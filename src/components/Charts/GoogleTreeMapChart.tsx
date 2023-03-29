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
    
};
export function GoogleTreeMapChart(props: TGoogleTreeMapChartProps) {
  const data = [
    [
      "Item",
      "Parent",
      "Size",
    ],
    ["Global", null, 0],
    ["America", "Global", 0],
    ["Europe", "Global", 0],
    ["Asia", "Global", 0],
    ["Australia", "Global", 0],
    ["Africa", "Global", 0],
    ["Brazil", "America", 11],
    ["USA", "America", 52],
    ["Mexico", "America", 24],
    ["Canada", "America", 16,],
    ["France", "Europe", 42,],
    ["Germany", "Europe", 31,],
    ["Sweden", "Europe", 22,],
    ["Italy", "Europe", 17],
    ["UK", "Europe", 21,],
    ["China", "Asia", 36],
    ["Japan", "Asia", 20,],
    ["India", "Asia", 400],
    ["Laos", "Asia", 4],
    ["Mongolia", "Asia", 1,],
    ["Israel", "Asia", 12],
    ["Iran", "Asia", 18],
    ["Pakistan", "Asia", 11,],
    ["Egypt", "Africa", 21],
    ["S. Africa", "Africa", 30],
    ["Sudan", "Africa", 12],
    ["Congo", "Africa", 10],
    ["Zaire", "Africa", 8],
  ];

  const options: Chart["props"]["options"] = {
    noColor: "#818b8e",
    minColor: "#9b7bf5",
    midColor: "#eed256",
    maxColor: "#f67676",
    headerHeight: 15,
    fontColor: "black",
    fontFamily: "DMMono",
    fontSize: 20,
    showScale: false,
  };
  return (
    <Chart
      chartType="TreeMap"
      width="100%"
      height="400px"
      data={data}
      options={options}
      className="wl-google-chart"
    />
  );
}
