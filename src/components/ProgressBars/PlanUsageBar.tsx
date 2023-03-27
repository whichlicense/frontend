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

import { ProgressBar } from "react-bootstrap";

type TPlanUsageBarProps = {
  total_minutes: number;
  leftover_minutes: number;
};
export default function PlanUsageBar(props: TPlanUsageBarProps) {
  return (
    <ProgressBar min={0} max={props.total_minutes}>
      <ProgressBar
        className="bg-yellow"
        striped
        variant="warning"
        max={props.leftover_minutes}
        now={
          props.leftover_minutes === props.total_minutes
            ? 0
            : props.total_minutes - props.leftover_minutes // usage
        }
        key={1}
      />
      <ProgressBar
        className="bg-blue"
        striped
        variant="info"
        max={props.total_minutes}
        now={
          props.total_minutes === props.leftover_minutes
            ? props.total_minutes
            : props.leftover_minutes
        }
        key={2}
      />
    </ProgressBar>
  );
}
