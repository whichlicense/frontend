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
import Chart from "react-apexcharts";

export function TreeMapChart(){
    const chartOpts: ApexCharts.ApexOptions = {
        series: [
          {
            data: [
              {
                x: "Colors.js",
                y: 10,
              },
              {
                x: "CLI Utils",
                y: 5,
              },
              {
                x: "lodash",
                y: 50,
              },
            ],
          },
        ],
        theme: {
          mode: "dark",
          palette: "palette5",
        },
        chart: {
          toolbar: {
            show: true,
            offsetX: -20,
            offsetY: 20,
            tools: {
              download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>`,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
            }
          },
          background: "transparent",
        },
        
        plotOptions: {
          treemap: {
            enableShades: true,
            // colorScale: {
            //   ranges: [
            //     { // smallest amount of items
            //       from: 0,
            //       to: 10,
            //       color: 'rgba(0,0,0,0.4)'
            //     },
            //     {
            //       from: 11,
            //       to: 20,
            //       color: 'rgba(0,0,0,0.3)'
            //     },
            //     {
            //       from: 21,
            //       to: 30,
            //       color: 'rgba(0,0,0,0.2)'
            //     },
            //     {
            //       from: 31,
            //       to: 100,
            //       color: 'rgba(0,0,0,0.1)'
    
            //     },
            //   ]
            // }
          }
        }
      }
      return (
        <Chart series={chartOpts.series} options={chartOpts} height={'100%'} type={"treemap"} />
      )
}