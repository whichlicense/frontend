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

import { useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Stack,
  Form,
  Badge,
} from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { useToolBar } from "../components/Hooks/useToolBar";
import { InlineCard } from "../components/Modals/InlineCard";
import { downloadPlainText } from "../components/utils/download";
import { LICENSE_1 } from "../components/utils/TEST_LICENSES";
import { ToolBarItemType } from "../context/ToolBarContext";

export default function ExportView() {
  const printRef = useRef<HTMLDivElement | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [printSettings, setPrintSettings] = useState({
    background: "#1e1e1e",
    showLegend: true,
    showTopLevelDependencies: true,
    showTransitiveDependencies: true,
    showCustomNotes: false,
    showNoticeAndWarning: true,
    addLicenses: false,
  });
  const [customNotes, setCustomNotes] = useState("Nothing provided.");
  // TODO: take in scan ID as url parameter.. go from there.
  // TODO: add chart display with associated options
  // TODO: table of contents generation
  // TODO: link license to their license text (if available)

  useToolBar([
    {
      type: ToolBarItemType.BUTTON,
      title: "Share",
      icon: "bi bi-share",
      onClick: () => {

      },
    },
    {
      type: ToolBarItemType.SEPARATOR,
      color: "bg-white"
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Export options",
      icon: "bi bi-sliders",
      onClick: () => {
        setShowExportOptions(true);
      },
    },
    {
      type: ToolBarItemType.SEPARATOR,
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Download PDF",
      icon: "bi bi-filetype-pdf",
      onClick: () => {
        print();
      },
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "HTML",
      icon: "bi bi-filetype-html",
      onClick: () => {
        // TODO: change file name to something more meaningful
        downloadPlainText("export.html", constructHTML());
      },
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "CSV",
      icon: "bi bi-filetype-csv",
      onClick: () => {
        // TODO: implement csv export when data structure is available
      },
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Text",
      icon: "bi bi-file-earmark-text",
      onClick: () => {
        // TODO: implement txt export when data structure is available
      },
    },
  ]);

  const constructHTML = () => {
    return `<html>
    <head>
        <title>PDF export</title>
        ${[
          ...document.querySelectorAll('link[rel="stylesheet"], style'),
        ].reduce((acc, node) => (acc += node.outerHTML), "")}
        <style>
            @page {
                size: A4;
                margin: 0 !important;
                padding: 0 !important;;
                border: none !important;
                background: ${printSettings.background};
            }
        </style>
    </head>
    <body onafterprint="self.close()" style="overflow: auto;">
        ${printRef.current!.outerHTML}
    </body>
</html>`;
  };

  const print = () => {
    const printWindow = window.open(
      "",
      "mywindow",
      "status=1,toolbar=0,scrollbars=0,left=0,top=0,innerWidth=793.7008,innerHeight=1122.5197"
    )!;
    printWindow.document.write(constructHTML());

    setTimeout(() => {
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div>
      <h1>Export view</h1>
      <small className="text-muted">
        Please note that the export view only serves as a rough visual
        indication as to how visual exports will end up. Non-visual exports like
        CSV will not carry over the visual aspects of the view.
      </small>
      <hr />
      <div
        ref={printRef}
        style={{
          backgroundColor: printSettings.background,
        }}
      >
        <Container fluid className="py-3">
          <Row className="g-3">
            <Col xs={6}>
              <Image src="http://localhost:3001/logo192.png" />
            </Col>
            <Col xs={6} className="text-end">
              <Stack gap={1}>
                <h6 className="display-4">ReactJS</h6>
                <h6>Version: 1.0.0</h6>
                <h6>Generated by: xxxxxxx</h6>
                <h6>Generated on: 2023-03-09T11:22:48.776Z</h6>
              </Stack>
            </Col>
            {printSettings.showCustomNotes && (
              <Col xs={12}>
                <RegularCard
                  title="Custom notes"
                  minHeight="100px"
                  maxHeight="100%"
                >
                  <textarea
                    defaultValue={customNotes}
                    className="w-100 bg-transparent border-0 rounded txt-white"
                    onBlur={(e) => setCustomNotes(e.target.value)}
                  ></textarea>
                </RegularCard>
              </Col>
            )}

            {printSettings.showLegend && (
              <Col xs={12}>
                <RegularCard title="Legend" maxHeight="100%">
                  {/* TODO: move to component and allow conditional rendering of each item for when a report does not have
                items of a given type */}
                  <Stack gap={2}>
                    <small className="ps-2">
                      <i className="pe-2 bi bi bi-info-circle-fill opacity-75"></i>
                      <span className="txt-green">Compliant</span> - A given
                      package and its transitive dependencies are licensed under
                      the same license or a compatible license with each
                      associated license having a high confidence.
                    </small>
                    <small className="ps-2">
                      <i className="pe-2 bi bi bi-info-circle-fill opacity-75"></i>
                      <span className="txt-green">Resolved</span> - A given
                      package has been{" "}
                      <b>marked compliant by an authorized user</b>. This is
                      typically done when a license with low confidence or an
                      unknown license is found, and thus marked, a compatible
                      license.
                    </small>
                    <small className="ps-2">
                      <i className="pe-2 bi bi bi-info-circle-fill opacity-75"></i>
                      <span className="txt-red">Incompliant</span> - A given
                      package has transitive dependencies that contain a license
                      which is perceived to be incompatible with its license
                      license.
                    </small>
                    <small className="ps-2">
                      <i className="pe-2 bi bi bi-info-circle-fill opacity-75"></i>
                      <span className="txt-red">Rejected</span> - A given
                      package was rejected <b>by an authorized user</b>.
                      Rejection typically happens when an incompatible license
                      was found and proven to be a potential risk factor.
                    </small>
                    <small className="ps-2">
                      <i className="pe-2 bi bi bi-info-circle-fill opacity-75"></i>
                      <span className="txt-yellow">Unresolved</span> - A given
                      package has unresolved issues (e.g., a license with low
                      confidence or an unknown license).
                    </small>
                    <small className="ps-2">
                      <i className="pe-2 bi bi bi-info-circle-fill opacity-75"></i>
                      <span className="txt-yellow">Missing dependency</span> - A
                      given package has a dependency that was not found in the
                      dependency resolution system. This is typically caused by
                      a dependency being private or the repository containing
                      those dependencies not being accessible.
                    </small>
                  </Stack>
                </RegularCard>
              </Col>
            )}

            <Col xs={6}>
              <RegularCard title="Status" minHeight="100px">
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

            {printSettings.showNoticeAndWarning && (
              <Col xs={12}>
                <RegularCard title="Warnings and Notices" maxHeight="100%">
                  <Stack gap={2}>
                    <small className="ps-2">
                      <i className="txt-yellow pe-2 bi bi-exclamation-triangle-fill opacity-75"></i>
                      Some warning message here
                    </small>

                    <small className="ps-2">
                      <i className="txt-blue pe-2 bi bi bi-info-circle-fill opacity-75"></i>
                      Some notice message here
                    </small>
                  </Stack>
                </RegularCard>
              </Col>
            )}

            {printSettings.showTopLevelDependencies && (
              <Col xs={12}>
                <RegularCard title="Top-level Dependencies" maxHeight="100%">
                  <ListGroup>
                    {Array.from({ length: 100 }).map((_, idx) => (
                      <ListGroup.Item as={"a"} href={`#dep-${idx}`} key={idx}>
                        <Row>
                          <Col xs={6}>Dependency {idx}</Col>
                          <Col xs={2}>
                            <div>1.0.0</div>
                          </Col>
                          <Col xs={2}>
                            <Badge className="bg-grey txt-dark-1">MIT</Badge>
                          </Col>
                          <Col xs={2} className="d-flex justify-content-end">
                            <Badge className="bg-green txt-dark-1">
                              Compliant
                            </Badge>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <br />
                  <br />
                  <br />
                </RegularCard>
              </Col>
            )}

            {printSettings.showTransitiveDependencies &&
              Array.from({ length: 100 }).map((_, idx) => (
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

            {printSettings.addLicenses &&
              Array.from({ length: 10 }).map((_, idx) => (
                <Col xs={12}>
                  <RegularCard title={`License ${idx}`} maxHeight="100%">
                    <div
                      className="bg-transparent"
                      style={{
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {LICENSE_1}
                    </div>
                  </RegularCard>
                </Col>
              ))}
          </Row>
        </Container>
      </div>
      <InlineCard
        title="Export options"
        show={showExportOptions}
        handleClose={() => setShowExportOptions(false)}
      >
        {/* TODO: make the items here-in a double decker list and in description tell a little about what
        the option does */}
        <Stack gap={2}>
          <div className="d-flex justify-content-between">
            Background color
            <Form.Control
              type="color"
              id="bgColor"
              defaultValue="#1e1e1e"
              title="Choose your color"
              onChange={(e) => {
                setPrintSettings({
                  ...printSettings,
                  background: e.target.value,
                });
              }}
            />
          </div>

          <div className="d-flex justify-content-between">
            Show legend box
            <Form.Check
              onChange={(e) => {
                setPrintSettings({
                  ...printSettings,
                  showLegend: e.target.checked,
                });
              }}
              type={"checkbox"}
              defaultChecked={printSettings.showLegend}
            />
          </div>

          <div className="d-flex justify-content-between">
            Show warnings and notices box
            <Form.Check
              onChange={(e) => {
                setPrintSettings({
                  ...printSettings,
                  showNoticeAndWarning: e.target.checked,
                });
              }}
              type={"checkbox"}
              defaultChecked={printSettings.showNoticeAndWarning}
            />
          </div>

          <div className="d-flex justify-content-between">
            Show top-level dependencies
            <Form.Check
              onChange={(e) => {
                setPrintSettings({
                  ...printSettings,
                  showTopLevelDependencies: e.target.checked,
                });
              }}
              type={"checkbox"}
              defaultChecked={printSettings.showTopLevelDependencies}
            />
          </div>

          <div className="d-flex justify-content-between">
            Include transitive dependencies
            <Form.Check
              onChange={(e) => {
                setPrintSettings({
                  ...printSettings,
                  showTransitiveDependencies: e.target.checked,
                });
              }}
              type={"checkbox"}
              defaultChecked={printSettings.showTransitiveDependencies}
            />
          </div>

          <div className="d-flex justify-content-between">
            Add custom notes box
            <Form.Check
              onChange={(e) => {
                setPrintSettings({
                  ...printSettings,
                  showCustomNotes: e.target.checked,
                });
              }}
              type={"checkbox"}
              defaultChecked={printSettings.showCustomNotes}
            />
          </div>

          <div className="d-flex justify-content-between">
            Add all used licenses as text
            <Form.Check
              onChange={(e) => {
                setPrintSettings({
                  ...printSettings,
                  addLicenses: e.target.checked,
                });
              }}
              type={"checkbox"}
              defaultChecked={printSettings.addLicenses}
            />
          </div>
        </Stack>
      </InlineCard>
    </div>
  );
}
