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

import { Stack } from "react-bootstrap";

type FullScreenLoaderProps = {
  message?: string | (string|null)[];
};
export default function FullScreenLoader(props: FullScreenLoaderProps) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Stack gap={3} className="justify-content-center align-items-center">
        <div className="spinner-border txt-blue" role="status"></div>
        {Array.isArray(props.message) ? (
          <span>
          <Stack>
            {props.message.map((msg, i) => (
              <h2 key={i} className="txt-white">
                {msg}
              </h2>
            ))}
          </Stack>
          </span>
        ) : (
          <span className="txt-white display-6">
            {props.message || "Loading.. please wait."}
          </span>
        )}
      </Stack>
    </div>
  );
}
