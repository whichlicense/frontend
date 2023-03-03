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

import { Col, Row, Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import RegularCard from "../components/Cards/RegularCard";
import DependencyList from "../components/Lists/DependencyList";
import { ComplianceStatus } from "../components/typings/DependencyStatus";

export default function ScanResult() {
  let { id } = useParams();
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h1 className="display-3">Colors.js</h1>
        <div>
          <Stack direction="vertical">
            <h3 className="display-5 text-end mb-0">
              {/* TODO: where did we get this license? whats our source? */}
              MIT
              <i className="ps-2 align-middle h5 bi bi-info-circle opacity-75"></i>
            </h3>
            <span className="opacity-75">
              Confidence: <span className="txt-green">100%</span>
            </span>
          </Stack>
        </div>
      </div>
      <br />

      {/* TODO: license diffing? error/notice board? pressing notice item to resolve license will open the diffing modal?
            Toolbar should also have resolve license button.
       */}

      <Row className="g-3">
        <Col>
          <Stack direction="horizontal" gap={3}>
            <RegularCard title={"Version"} fadeIn>
              <h6>Semantic: 2.0.5</h6>
              <h6>Original: Ver-2.0.5_alpha #2</h6>
            </RegularCard>
            <RegularCard title={"Notice"} fadeIn>
              {/* TODO: list here with the notices of this specific package */}
              <h5>Something click to resolve..</h5>
            </RegularCard>
          </Stack>
        </Col>

        {/* TODO: collapsed item with the tree in it.. */}
        {/* TODO: what about other information like the URL of the repo? */}

        <Col xs={12}>
          <RegularCard minHeight="50vh" title={"Dependencies"} fadeIn>
            <DependencyList
              dependencies={[
                {
                  name: "colors",
                  version: "2.0.5",
                  license: "MIT",
                  compliance: ComplianceStatus.COMPLIANT,
                },
                {
                  name: "Some awesome dep",
                  version: "2.0.5",
                  license: "Apache 2.0",
                  compliance: ComplianceStatus.COMPLIANT,
                },
                {
                  name: "Not so cool",
                  version: "2.0.5",
                  license: "GPL 3.0",
                  compliance: ComplianceStatus.NON_COMPLIANT,
                },
                {
                  name: "Terrible",
                  version: "2.0.5",
                  license: "AGPL",
                  compliance: ComplianceStatus.NON_COMPLIANT,
                },
                {
                  name: "OH NO!",
                  version: "2.0.5",
                  license: "Proprietary",
                  compliance: ComplianceStatus.NON_COMPLIANT,
                },
                { name: "colors", version: "2.0.5", license: "MIT" },
                { name: "colors", version: "2.0.5", license: "MIT" },
                { name: "colors", version: "2.0.5", license: "MIT" },
                { name: "colors", version: "2.0.5", license: "MIT" },
                { name: "colors", version: "2.0.5", license: "MIT" },
                { name: "colors", version: "2.0.5", license: "MIT" },
                { name: "colors", version: "2.0.5", license: "MIT" },
                { name: "colors", version: "2.0.5", license: "MIT" },
              ]}
            />
          </RegularCard>
        </Col>
      </Row>
    </div>
  );
}
