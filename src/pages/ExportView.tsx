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

import { useEffect, useMemo, useRef, useState } from "react";
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
import { GoogleTreeMapChart } from "../components/Charts/GoogleTreeMapChart";
import Mermaid from "../components/Charts/Mermaid";
import { useToolBar } from "../components/Hooks/useToolBar";
import { InlineCard } from "../components/Modals/InlineCard";
import { downloadPlainText } from "../components/utils/download";
import { LICENSE_1 } from "../components/utils/TEST_LICENSES";
import { ToolBarItemType } from "../context/ToolBarContext";
import { ETelemetryEntryType, Telemetry } from "../components/utils/Telemetry";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useProviderContext } from "../context/ProviderContext";
import { TDiscoverOut } from "../types/discover";
import FullScreenLoader from "../components/Loaders/FullScreenLoader";
import { fromHex, time } from "../components/utils/identity";

// TODO: remove me.. only for testing
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// TODO: remove me.. only for testing
const test_nested_dependencies = Array.from(
  { length: getRandomInt(4, 10) },
  (_, i) => {
    return {
      id: `P${i}`,
      name: `Top level dependency ${i}`,
      version: `${getRandomInt(1, 10)}.${getRandomInt(1, 10)}.${getRandomInt(
        1,
        50
      )}`,
      license: LICENSE_1,
      compliant: getRandomInt(0, 1) === 1,
      dependencies: Array.from({ length: getRandomInt(1, 4) }, (_, j) => {
        return {
          id: `P${i}.${j}`,
          name: `Package ${i}.${j}`,
          version: `${getRandomInt(1, 10)}.${getRandomInt(
            1,
            10
          )}.${getRandomInt(1, 50)}`,
          license: LICENSE_1,
          compliant: getRandomInt(0, 1) === 1,
          dependencies: Array.from({ length: getRandomInt(1, 3) }, (_, k) => {
            return {
              id: `P${i}.${j}.${k}`,
              name: `Package ${i}.${j}.${k}`,
              version: `${getRandomInt(1, 10)}.${getRandomInt(
                1,
                10
              )}.${getRandomInt(1, 50)}`,
              license: LICENSE_1,
              compliant: getRandomInt(0, 1) === 1,
              dependencies: Array.from(
                { length: getRandomInt(1, 3) },
                (_, l) => {
                  return {
                    id: `P${i}.${j}.${k}.${l}`,
                    name: `Package ${i}.${j}.${k}.${l}`,
                    version: `${getRandomInt(1, 10)}.${getRandomInt(
                      1,
                      10
                    )}.${getRandomInt(1, 50)}`,
                    license: LICENSE_1,
                    compliant: getRandomInt(0, 1) === 1,
                    dependencies: Array.from({ length: 2 }, (_, m) => {
                      return {
                        id: `P${i}.${j}.${k}.${l}.${m}`,
                        name: `Package ${i}.${j}.${k}.${l}.${m}`,
                        version: `${getRandomInt(1, 10)}.${getRandomInt(
                          1,
                          10
                        )}.${getRandomInt(1, 50)}`,
                        license: LICENSE_1,
                        compliant: getRandomInt(0, 1) === 1,
                        dependencies: [],
                      };
                    }),
                  };
                }
              ),
            };
          }),
        };
      }),
    };
  }
);

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
    showDependencyMindMap: false,
    showDependencyExposure: true,
    addLicenses: false,
  });
  const [customNotes, setCustomNotes] = useState("Nothing provided.");
  const telemetry = Telemetry.instance;
  // TODO: take in scan ID as url parameter.. go from there.
  // TODO: add chart display with associated options
  // TODO: table of contents generation
  // TODO: link license to their license text (if available)
  // TODO: ensure we include our FONT via some URL (CDN?) or something... we can host it on the server is required

  useToolBar([
    {
      type: ToolBarItemType.BUTTON,
      title: "Share",
      icon: "bi bi-share",
      onClick: () => {
        try {
          navigator.share({
            // TODO: meaningful title
            title: "WhichLicense result",
            // TODO: meaningful text
            text: "ReactJS 1.0.0",
            url: window.location.href,
          });
          telemetry.addEntry({
            type: ETelemetryEntryType.INTERACTION,
            title: "Share pressed",
          });
        } catch (_) {
          navigator.clipboard.writeText(window.location.href);
        }
      },
    },
    {
      type: ToolBarItemType.SEPARATOR,
      color: "bg-white",
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Export options",
      icon: "bi bi-sliders",
      onClick: () => {
        setShowExportOptions(true);
        telemetry.addEntry({
          type: ETelemetryEntryType.INTERACTION,
          title: "Open Export options",
          description: `Options: \n${Object.entries(printSettings)
            .map(([k, v]) => `\t${k}: ${v}`)
            .join("\n")}`,
        });
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
        telemetry.addEntry({
          type: ETelemetryEntryType.INTERACTION,
          title: "Download PDF pressed",
        });
      },
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "HTML",
      icon: "bi bi-filetype-html",
      onClick: () => {
        // TODO: change file name to something more meaningful
        downloadPlainText("export.html", constructHTML());
        telemetry.addEntry({
          type: ETelemetryEntryType.INTERACTION,
          title: "Download HTML pressed",
        });
      },
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "CSV",
      icon: "bi bi-filetype-csv",
      onClick: () => {
        // TODO: implement csv export when data structure is available
        telemetry.addEntry({
          type: ETelemetryEntryType.INTERACTION,
          title: "Download CSV pressed",
        });
      },
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Text",
      icon: "bi bi-file-earmark-text",
      onClick: () => {
        // TODO: implement txt export when data structure is available
        telemetry.addEntry({
          type: ETelemetryEntryType.INTERACTION,
          title: "Download Text pressed",
        });
      },
    },
  ]);

  const navigate = useNavigate();
  const { id } = useParams();
  const { provider } = useProviderContext();

  const [scan, setScan] = useState<TDiscoverOut | undefined>(undefined);
  const [allScanDetailed, setAllScanDetailed] = useState<
    Map<string, TDiscoverOut> | undefined
  >(undefined);

  if (id === undefined) {
    toast.error("No scan id provided");
    navigate("/dashboard");
  }

  useEffect(() => {
    if (!id) return;
    provider.getScan(id, true).then((res) => {
      setScan(res);
      
      console.log(Object.values(res.dependencies));
      provider
        .getScans(
          Object.values(res.dependencies)
            // .filter((x) => x.kind === "DIRECT")
            .map((dep) => dep.scans[dep.version]),
          true
        )
        .then((transitiveRes) => {
          setAllScanDetailed(
            new Map(
              transitiveRes.map((tsc) => {
                return [tsc.identity as string, tsc];
              })
            )
          );
        });
    });
  }, [id, provider]);

  const constructHTML = () => {
    return `<html>
    <head>
        <title>PDF export</title>
        ${[
          ...document.querySelectorAll(
            'link[rel="stylesheet"], style, script[src]'
          ),
        ].reduce((acc, node) => (acc += "\n" + node.outerHTML), "")}
        
        <style type="text/css" media="print">
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

  // TODO: for dependency exposure, put names in boxes, size based on amount of direct dependencies, color based on compliancy status

  const constructedMermaidGraph = useMemo(() => {
    return printSettings.showDependencyMindMap
      ? `mindmap
\tReactJS
${test_nested_dependencies
  .map((node) => traverseAndRenderMermaid(2, node))
  .join("")}`
      : "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printSettings.showDependencyMindMap, test_nested_dependencies]);

  function traverseAndRenderMermaid(
    level: number,
    node: (typeof test_nested_dependencies)[0]
  ) {
    const classes = node.compliant ? "\n:::bg-green" : "\n:::bg-red";
    let mermaidString = `${"\t".repeat(level)}${node.name}${classes}\n`;
    for (const dep of node.dependencies) {
      mermaidString += traverseAndRenderMermaid(level + 1, dep);
    }
    return mermaidString;
  }

  const constructedOrgChartData = useMemo(() => {
    const contents  = Object.entries(scan?.dependencies || {}).filter(x=>x[1].kind === "DIRECT").map(([depName, depItem]) => {
      const directDepInfo = allScanDetailed?.get(depItem.scans[depItem.version]);
      return [
        depName,
        scan?.name || "ERROR",
        Object.keys(directDepInfo?.dependencies || {}).length + 1,
      ];
    })
    return [
      [(scan?.name || "ERROR"), null, 0],
      ...contents
    ] as [string, string | null, number][];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scan, allScanDetailed, printSettings.showDependencyExposure]);

  if (!scan || !allScanDetailed)
    return (
      <div>
        <FullScreenLoader
          message={[
            !scan ? `Fetching Top level scan` : null,
            !allScanDetailed ? `Fetching Transitive scan details` : null,
          ]}
        />
      </div>
    );
  return (
    <div className="fade-in-forward">
      <h1>Export view</h1>
      <small className="text-muted">
        Please note that the export view only serves as a rough visual
        indication as to how visual exports will end up. Non-visual exports like
        CSV will not carry over the visual aspects of the view.
      </small>
      <br />
      <small className="text-muted">
        {/* TODO: only show on safari user agent */}
        <i className="txt-yellow pe-2 bi bi-exclamation-triangle-fill"></i>
        We are aware of an issue causing the PDF export to not behave according
        to our specification in Safari and Firefox. Unfortunately we are at the
        mercy of said browsers aligning their browser specifications with the
        rest of the industry. For FireFox we recommend going into the settings
        manually and changing the default print settings to paper size A4 and
        turning on the "print backgrounds" settings.
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
            <Col xs={3} className="pb-2">
              <Image fluid src="/logo512.png" />
            </Col>
            <Col xs={9} className="text-end">
              <Stack gap={1}>
                <h6 className="display-4">{scan?.name}</h6>
                <h6>Version: {scan.version}</h6>
                <h6>Generated by: Platform microservices</h6>
                <h6>Generated on: {new Date().toISOString()}</h6>
                <h6>
                  Scanned on:{" "}
                  {time(fromHex(scan.identity as string)).toISOString()}
                </h6>
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
                <h4 className="txt-green">Unknown</h4>
              </RegularCard>
            </Col>
            <Col xs={6}>
              <RegularCard title="License" minHeight="100px">
                <a
                  href="#test-anchor"
                  className="h4 txt-green text-decoration-none"
                >
                  {scan.discoveredLicense || scan.declaredLicense || "Unknown"}
                </a>
              </RegularCard>
            </Col>

            {printSettings.showNoticeAndWarning && (
              <Col xs={12}>
                <RegularCard title="Warnings and Notices" maxHeight="100%">
                  <Stack gap={2}>
                    <small className="ps-2">
                      <i className="txt-yellow pe-2 bi bi-exclamation-triangle-fill opacity-75"></i>
                      Classification & compliancy system not implemented
                    </small>

                    <small className="ps-2">
                      <i className="txt-yellow pe-2 bi bi-exclamation-triangle-fill opacity-75"></i>
                      Unable to obtain license text for some packages
                    </small>

                    <small className="ps-2">
                      <i className="txt-blue pe-2 bi bi bi-info-circle-fill opacity-75"></i>
                      Nested dependency tree not available
                    </small>
                  </Stack>
                </RegularCard>
              </Col>
            )}

            {printSettings.showDependencyExposure && (
              <Col xs={12}>
                <RegularCard
                  title={"Dependency exposure"}
                  minHeight="100%"
                  maxHeight="100%"
                >
                  <GoogleTreeMapChart
                    bg="bg-card"
                    data={constructedOrgChartData}
                    resizableContainerId="nav-content-section"
                    maxDepth={2}
                    maxPostDepth={0}
                  />
                </RegularCard>
              </Col>
            )}

            {printSettings.showDependencyMindMap && (
              <Col>
                <RegularCard
                  title={"Dependency map"}
                  minHeight="100%"
                  maxHeight="100%"
                >
                  <Mermaid content={constructedMermaidGraph}></Mermaid>
                </RegularCard>
              </Col>
            )}

            {printSettings.showTopLevelDependencies && (
              <Col xs={12}>
                <RegularCard title="Direct Dependencies" maxHeight="100%">
                  <ListGroup>
                    {Object.entries(scan.dependencies)
                      .filter(([_, v]) => v.kind === "DIRECT")
                      .map(([depName, item], idx) => {
                        const fullDetails = allScanDetailed.get(
                          item.scans[item.version]
                        );
                        if (!fullDetails)
                          return (
                            <ListGroup.Item key={idx}>
                              Error retrieving information for {depName}
                            </ListGroup.Item>
                          );
                        return (
                          <ListGroup.Item
                            as={"a"}
                            href={`#dep-${idx}`}
                            key={idx}
                          >
                            <Row>
                              <Col xs={6}>{depName}</Col>
                              <Col xs={2}>
                                <div>{item.version}</div>
                              </Col>
                              <Col xs={2}>
                                <Badge className="bg-grey txt-dark-1">
                                  {fullDetails.discoveredLicense || fullDetails.declaredLicense || "Unknown"}
                                </Badge>
                              </Col>
                              <Col
                                xs={2}
                                className="d-flex justify-content-end"
                              >
                                <Badge className="bg-green txt-dark-1">
                                  Unknown
                                </Badge>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        );
                      })}
                  </ListGroup>
                  <br />
                  <br />
                  <br />
                </RegularCard>
              </Col>
            )}

            {printSettings.showTransitiveDependencies &&
               <Col xs={12}>
               <RegularCard title="Transitive Dependencies" maxHeight="100%">
                 <ListGroup>
                   {Object.entries(scan.dependencies)
                     .filter(([_, v]) => v.kind === "TRANSITIVE")
                     .map(([depName, item], idx) => {
                       const fullDetails = allScanDetailed.get(
                         item.scans[item.version]
                       );
                       if (!fullDetails)
                         return (
                           <ListGroup.Item key={idx}>
                             Error retrieving information for {depName}
                           </ListGroup.Item>
                         );
                       return (
                         <ListGroup.Item
                           as={"a"}
                           href={`#dep-${idx}`}
                           key={idx}
                         >
                           <Row>
                             <Col xs={6}>{depName}</Col>
                             <Col xs={2}>
                               <div>{item.version}</div>
                             </Col>
                             <Col xs={2}>
                               <Badge className="bg-grey txt-dark-1">
                                 {fullDetails.discoveredLicense || fullDetails.declaredLicense || "Unknown"}
                               </Badge>
                             </Col>
                             <Col
                               xs={2}
                               className="d-flex justify-content-end"
                             >
                               <Badge className="bg-green txt-dark-1">
                                 Unknown
                               </Badge>
                             </Col>
                           </Row>
                         </ListGroup.Item>
                       );
                     })}
                 </ListGroup>
                 <br />
                 <br />
                 <br />
               </RegularCard>
             </Col>
             }

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
        handleClose={() => {
          setShowExportOptions(false);
          telemetry.addEntry({
            type: ETelemetryEntryType.INTERACTION,
            title: "Close export options",
            description: `Options: \n${Object.entries(printSettings)
              .map(([k, v]) => `\t${k}: ${v}`)
              .join("\n")}`,
          });
        }}
      >
        {/* TODO: make the items here-in a double decker list and in description tell a little about what
        the option does */}
        <Stack gap={2}>
          <Stack direction="horizontal" gap={3}>
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
            Background color
          </Stack>

          <Stack direction="horizontal" gap={3}>
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
            Show legend box
          </Stack>

          <Stack direction="horizontal" gap={3}>
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
            Show warnings and notices box
          </Stack>

          <Stack direction="horizontal" gap={3}>
            <Form.Check
              onChange={(e) => {
                setPrintSettings({
                  ...printSettings,
                  showDependencyMindMap: e.target.checked,
                });
              }}
              type={"checkbox"}
              defaultChecked={printSettings.showDependencyMindMap}
            />
            Show dependency map graph
          </Stack>

          <Stack direction="horizontal" gap={3}>
            <Form.Check
              onChange={(e) => {
                setPrintSettings({
                  ...printSettings,
                  showDependencyExposure: e.target.checked,
                });
              }}
              type={"checkbox"}
              defaultChecked={printSettings.showDependencyExposure}
            />
            Show dependency exposure (tree map)
          </Stack>

          <Stack direction="horizontal" gap={3}>
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
            Show top-level dependencies
          </Stack>

          <Stack direction="horizontal" gap={3}>
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
            Include transitive dependencies
          </Stack>

          <Stack direction="horizontal" gap={3}>
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
            Add custom notes box
          </Stack>

          <Stack direction="horizontal" gap={3}>
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
            Add all used licenses as text
          </Stack>
        </Stack>
      </InlineCard>
    </div>
  );
}
