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

type HBarChartProps = {
  series: ApexCharts.ApexOptions["series"];
  /**
   * see: https://apexcharts.com/docs/options/theme/
   */
  palette?:
    | "palette1"
    | "palette2"
    | "palette3"
    | "palette4"
    | "palette5"
    | "palette6"
    | "palette7"
    | "palette8"
    | "palette9"
    | "palette10";
};
export default function HBarChart(props: HBarChartProps) {
  const chartOpts: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 12,
        borderRadiusApplication: "around",
        columnWidth: "85%",
      },
    },

    grid: {
      show: true,
      borderColor: "rgba(0,0,0,0.2)",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    theme: {
      mode: "dark",
      palette: props.palette || "palette10",
    },
    xaxis: {
      labels: {
        trim: true,
        style: {
          fontFamily: "OxygenMono",
          fontSize: "15px",
          colors: "rgb(16, 16, 16)",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 2,
      labels: {
        style: {
          fontFamily: "OxygenMono",
          fontSize: "14px",
          colors: "rgb(16, 16, 16)",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    series: props.series,
  };
  return (
    <Chart
      series={chartOpts.series}
      options={chartOpts}
      height={"100%"}
      type={"bar"}
    />
  );
}
