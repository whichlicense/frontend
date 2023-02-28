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
import React from 'react';
import Chart from "react-apexcharts";

export function Test() {
    const options: any = {
        series: [
          {
            data: [
              {
                x: "New Delhi",
                y: 218,
              },
              {
                x: "Kolkata",
                y: 149,
              },
              {
                x: "Mumbai",
                y: 184,
              },
              {
                x: "Ahmedabad",
                y: 55,
              },
              {
                x: "Bangaluru",
                y: 84,
              },
              {
                x: "Pune",
                y: 31,
              },
              {
                x: "Chennai",
                y: 70,
              }
            ],
          },
        ]
    };
    
    return (
        <div className="App">
        <Chart series={options.series} options={options} type={'treemap'} />
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
}