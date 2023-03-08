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

import {  useRef, useState } from "react";
import { Container, Row, Col, ListGroup, Image, Stack } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { useToolBar } from "../components/Hooks/useToolBar";
import { InlineCard } from "../components/Modals/InlineCard";
import { ToolBarItemType } from "../context/ToolBarContext";

export default function PdfExport() {
  const printRef = useRef<HTMLElement | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  useToolBar([
    {
        type: ToolBarItemType.BUTTON,
        title: "Export options",
        icon: "bi bi-sliders",
        onClick: () => {
            setShowExportOptions(true)
        },
      },
    {
        type: ToolBarItemType.SEPARATOR,
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Download PDF",
      icon: "bi bi-file-earmark-arrow-down",
      onClick: () => {
        print();
      },
    },
  ]);

  const print = () => {
    const printWindow = window.open(
      "",
      "mywindow",
      "status=1,toolbar=0,scrollbars=0,left=0,top=0"
    )!;
    printWindow.document.write(`<html>
    <head>
        <title>PDF export</title>
        ${[
          ...document.querySelectorAll('link[rel="stylesheet"], style'),
        ].reduce((acc, node) => (acc += node.outerHTML), "")}
        <style>
            @page {
                size: A4;
                margin: 0;
            }
        </style>
    </head>
    <body onafterprint="self.close()">
        ${printRef.current!.outerHTML}
    </body>
</html>`);

    setTimeout(() => {
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div>
      <h1>PDF export view</h1>
      <hr />
      <section ref={printRef}>
        <Container fluid className="py-3">
          <Row className="g-3">
            <Col xs={6}>
              <Image src="logo192.png" />
            </Col>
            <Col xs={6} className="text-end">
              <Stack gap={1}>
                <h6 className="display-4">ReactJS</h6>
                <h6>Version: 1.0.0</h6>
                <h6>Generated by: xxxxxxx</h6>
                <h6>Generated on: {new Date().toISOString()}</h6>
              </Stack>
            </Col>
            <Col xs={6}>
              <RegularCard title="Compliancy" minHeight="100px">
                <h4 className="txt-green">Compliant</h4>
              </RegularCard>
            </Col>
            <Col xs={6}>
              <RegularCard title="License" minHeight="100px">
                <a
                  href="#test-anchor"
                  className="h4 txt-green text-decoration-none"
                >
                  MIT
                </a>
              </RegularCard>
            </Col>
            <Col xs={12}>
              <RegularCard title="Dependencies" maxHeight="100%">
                <ListGroup>
                  {Array.from({ length: 100 }).map((_, idx) => (
                    <ListGroup.Item as={"a"} href={`#dep-${idx}`} key={idx}>
                      Dependency {idx}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <br />
                <br />
                <br />
              </RegularCard>
            </Col>
            {Array.from({ length: 100 }).map((_, idx) => (
              <Col xs={16}>
                <RegularCard
                  title={`Dependency ${idx}'s dependencies`}
                  maxHeight="100%"
                  id={`dep-${idx}`}
                >
                  <ListGroup>
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <ListGroup.Item key={idx}>
                        Transitive dependency {idx}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <br />
                  <br />
                  <br />
                </RegularCard>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <InlineCard title="Export options" show={showExportOptions} handleClose={()=>setShowExportOptions(false)}>
        <p>Test</p>
      </InlineCard>
    </div>
  );
}
