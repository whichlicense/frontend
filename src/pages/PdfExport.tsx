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

import { useEffect, useRef } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { useToolBar } from "../components/Hooks/useToolBar";
import { downloadPdf } from "../components/utils/downloadPdf";
import { ToolBarItemType } from "../context/ToolBarContext";

export default function PdfExport() {
    const printRef = useRef<any>(undefined);

    useToolBar([
        {
            type: ToolBarItemType.BUTTON,
            title: "Download PDF",
            icon: "bi bi-file-earmark-arrow-down",
            onClick: () => {
                downloadPdf(printRef, {
                    fileName: `WhichLicense export ${new Date().toISOString()}.pdf`,
                })
            }
        }
    ]);

  return (
    <div>
      <h1>PDF Export</h1>
      <section
        ref={printRef}
        style={{
          overflow: "hidden",
        }}
      >
        <Container>
          <Row>
            <Col xs={6} className="bg-black">
              Our logo here?
            </Col>
            <Col xs={6} className="bg-red">
              Some <br />
              basic <br />
              info <br />
              here
            </Col>
          </Row>
          <br />
          <br />
          <RegularCard title="Basic notifications" maxHeight="101%">
            <ListGroup>
              {Array.from({ length: 100 }).map((_, idx) => (
                <ListGroup.Item key={idx}>Item {idx}</ListGroup.Item>
              ))}
            </ListGroup>
          </RegularCard>
        </Container>
      </section>
    </div>
  );
}
