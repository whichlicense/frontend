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

import { useEffect, useState } from "react";
import { Col, ListGroup, Row, Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import RegularCard from "../components/Cards/RegularCard";
import DependencyList from "../components/Lists/DependencyList";
import { InlineCard } from "../components/Modals/InlineCard";
import { ComplianceStatus } from "../components/typings/DependencyStatus";
import { ToolBarItemType, useToolBarContext } from "../context/ToolBarContext";
import ReactDiffViewer from 'react-diff-viewer';
import { LICENSE_1, LICENSE_2 } from "../components/utils/TEST_LICENSES";


export default function ScanResult() {
  const { id } = useParams();
  const { setItems } = useToolBarContext();
  const [showResolveLicense, setShowResolveLicense] = useState(false);

  useEffect(() => {
    setItems([
      {
        type: ToolBarItemType.BUTTON,
        icon: "bi bi-check-circle",
        bgColor: "bg-yellow",
        onClick: () => {
          console.log("icon clicked");
        },
      },
      {
        type: ToolBarItemType.BUTTON,
        title: "Resolve License",
        icon: "bi bi-check-circle",
        onClick: () => {
          setShowResolveLicense(true);
        },
      },
      {
        type: ToolBarItemType.SEPARATOR,
      },
      {
        type: ToolBarItemType.BUTTON,
        title: "License info",
        icon: "bi bi-info-circle",
        onClick: () => {
          console.log("button clicked");
        },
      },
    ]);

    return () => setItems([]);
  }, []);
  return (
    <div>
      <InlineCard
        title="Resolve"
        show={showResolveLicense}
        handleClose={() => setShowResolveLicense(false)}
      >
        <Row className="g-3">
          <Col xs={6}>
            <RegularCard title={"License details"} minHeight="20vh">
              <h5>License: MIT</h5>
              <h5>Confidence: 100</h5>
              <h5>
                Source:{" "}
                <a
                  className="txt-blue"
                  href="https://github.com/whichlicense/license-detection/blob/main/LICENSE"
                >
                  github.com/whichlicense/
                </a>
              </h5>
            </RegularCard>
          </Col>
          <Col xs={6}>
            <RegularCard title={"Similar licenses"} minHeight="20vh">
              <ListGroup>
                {Array.from({ length: 8 }).map((_, i) => (
                  <ListGroup.Item className="d-flex justify-content-between align-items-start">
                    <div>MIT-2</div>
                    <div>Confidence: 98%</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </RegularCard>
          </Col>
          <Col xs={12}>
            <RegularCard title={"License difference view"} minHeight="50vh">
              <ReactDiffViewer oldValue={LICENSE_1} newValue={LICENSE_2} splitView={true} useDarkTheme />
            </RegularCard>
          </Col>
        </Row>
      </InlineCard>
      <div className="d-flex justify-content-between">
        <h1 className="display-3">Colors.js</h1>
        <div>
          <Stack direction="vertical">
            <h3 className="display-5 text-end mb-0">
              {/* TODO: where did we get this license? whats our source? */}
              {/* TODO: what about multiple licenses? Some projects allow you to choose..
                we will need to allow someone to resolve (or choose) one or all? */}
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
