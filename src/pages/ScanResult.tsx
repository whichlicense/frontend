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

import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Col,
  Form,
  Row,
  Stack,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import RegularCard from "../components/Cards/RegularCard";
import DependencyList from "../components/Lists/DependencyList";
import { InlineCard } from "../components/Modals/InlineCard";
import { ComplianceStatus } from "../components/typings/DependencyStatus";
import { ToolBarItemType } from "../context/ToolBarContext";
import ReactDiffViewer from "react-diff-viewer";
import { LICENSE_1, LICENSE_2 } from "../components/utils/TEST_LICENSES";
import { useToolBar } from "../components/Hooks/useToolBar";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ETelemetryEntryType, Telemetry } from "../components/utils/Telemetry";
import { useProviderContext } from "../context/ProviderContext";
import { TDiscoverOut } from "../types/discover";
import { TGitHubLicenseInfo, getInfo } from "../components/utils/LicenseInfo";

// TODO: scan again toolbar button
// TODO: scan latest version toolbar button
// TODO: optional query param that identifies the main to-level scan (the user project). This is used to show compatibility information

export default function ScanResult() {
  const { id } = useParams();
  const [showResolveLicense, setShowResolveLicense] = useState(false);
  const navigate = useNavigate();
  const { provider } = useProviderContext();

  if (id === undefined) {
    toast.error("No scan id provided");
    navigate("/dashboard");
  }

  const telemetry = Telemetry.instance;

  useToolBar([
    {
      type: ToolBarItemType.BUTTON,
      title: "Resolve Package", // TODO: remove if not required.
      icon: "bi bi-check-circle",
      onClick: () => {
        setShowResolveLicense(true);
        telemetry.addEntry({
          type: ETelemetryEntryType.INTERACTION,
          title: "Open Resolve Package",
        });
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
        document.getElementById("license_info_link")?.click();
      },
    },
    {
      type: ToolBarItemType.SEPARATOR,
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Add as project",
      icon: "bi bi-cloud-plus",
      onClick: () => {
        console.log("button clicked");
        telemetry.addEntry({
          type: ETelemetryEntryType.INTERACTION,
          title: "Press Add as project",
        });
      },
    },
    {
      type: ToolBarItemType.SEPARATOR,
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Export",
      icon: "bi bi-file-earmark-arrow-down",
      onClick: () => {
        telemetry.addEntry({
          type: ETelemetryEntryType.INTERACTION,
          title: "Press Export",
        });
        navigate("/export-view/" + id);
      },
    },
  ]);

  const auth = useAuthContext();

  // TODO: for resolve -> if not licensed allow a lawyer to say "this is fine" or "this is not fine"
  // TODO: here's a long list of all the files that have not been licensed. please review and accept, decline or resolve
  // TODO: show ability to change version of the "view"

  const [dummyData, setDummyData] = useState<TDiscoverOut>();

  useEffect(() => {
    if (!id) return;
    provider.getScan(id).then((res) => {
      setDummyData(res);
    });
  }, [auth.token, id, provider]);

  const [licenseInfo, setLicenseInfo] = useState<
    TGitHubLicenseInfo | undefined
  >(undefined);

  useEffect(() => {
    if (!dummyData) return;
    getInfo(
      dummyData?.discoveredLicense || dummyData?.declaredLicense || "NONE"
    ).then((res) => {
      setLicenseInfo(res);
    });
  }, [dummyData]);


  return (
    <div>
      <InlineCard
        title="Resolve"
        show={showResolveLicense}
        handleClose={() => {
          telemetry.addEntry({
            type: ETelemetryEntryType.INTERACTION,
            title: "Close Resolve Package",
          });
          setShowResolveLicense(false);
        }}
      >
        <Row className="g-3">
          <Col xs={12}>
            <Stack gap={1}>
              <ButtonGroup>
                <Button className="bg-green">Accept package</Button>
                <Button className="bg-red">Decline package</Button>
                <Button className="bg-blue">
                  Resolve the below entered information
                </Button>
              </ButtonGroup>
              <small>
                <i className="px-2 bi bi-info-circle opacity-75"></i>
                <span className="txt-green">Accepting</span> a package will
                allow the package, its current license and any associated risks.
              </small>
              <small>
                <i className="px-2 bi bi-info-circle opacity-75"></i>
                <span className="txt-red">Declining</span> a package will flag
                it for removal, send a notification to any relevant parties and
                force errors that show up in exports and other views.
              </small>
              <small>
                <i className="px-2 bi bi-info-circle opacity-75"></i>
                <span className="txt-blue">Resolving</span> takes in the changes
                that has been entered within this card as the "truth".
              </small>
            </Stack>
          </Col>
          <Col xs={6}>
            <RegularCard
              title={"License details"}
              minHeight="20vh"
              maxHeight="20vh"
            >
              <h5>
                <Stack direction="horizontal">
                  <div>License: </div>
                  <Form.Select className="py-0 bg-yellow w-25 border-0">
                    {Object.entries(
                      dummyData?.discoveredLicenseTrace?.traces[
                        dummyData?.discoveredLicenseTrace.traces.length - 1
                      ]?.matches || {}
                    )
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, conf]) => {
                        return (
                          <option value={name}>
                            {name} - {conf}% confidence
                          </option>
                        );
                      })}
                  </Form.Select>
                </Stack>
              </h5>
              {/* <h5>Confidence: 100</h5>
              <h5>
                Source:{" "}
                <a
                  className="txt-blue"
                  href="https://github.com/whichlicense/license-detection/blob/main/LICENSE"
                >
                  {}
                </a>
              </h5> */}
            </RegularCard>
          </Col>
          <Col xs={6}>
            <RegularCard title="Custom notes" minHeight="20vh" maxHeight="20vh">
              <textarea
                // defaultValue={customNotes}
                className="w-100 bg-transparent border-0 rounded txt-white"
                // onBlur={(e) => setCustomNotes(e.target.value)}
              ></textarea>
            </RegularCard>
          </Col>

          <Col xs={4}>
            <RegularCard
              title={"Permissions"}
              minHeight="20vh"
              maxHeight="20vh"
            >
              <>
                {licenseInfo?.permissions.map((perm) => {
                  return (
                    <Badge bg="green" className="m-1 txt-dark-1">
                      {perm}
                    </Badge>
                  );
                })}
              </>
            </RegularCard>
          </Col>

          <Col xs={4}>
            <RegularCard
              title={"Limitations"}
              minHeight="20vh"
              maxHeight="20vh"
            >
              <>
                {licenseInfo?.limitations.map((perm) => {
                  return (
                    <Badge bg="red" className="m-1 txt-dark-1">
                      {perm}
                    </Badge>
                  );
                })}
              </>
            </RegularCard>
          </Col>

          <Col xs={4}>
            <RegularCard title={"Conditions"} minHeight="20vh" maxHeight="20vh">
              <>
                {licenseInfo?.conditions.map((perm) => {
                  return (
                    <Badge bg="yellow" className="m-1 txt-dark-1">
                      {perm}
                    </Badge>
                  );
                })}
              </>
            </RegularCard>
          </Col>

          <Col xs={12}>
            <RegularCard title={"License difference view"} minHeight="50vh">
              <ReactDiffViewer
                oldValue={
                  dummyData?.discoveredLicenseTrace?.input || "NOT FOUND"
                }
                newValue={licenseInfo?.body || "NOT FOUND"}
                splitView={true}
                useDarkTheme
              />
            </RegularCard>
          </Col>
        </Row>
      </InlineCard>
      {/* TODO: where did we get this license? whats our source? */}
      {/* TODO: what about multiple licenses? Some projects allow you to choose..
                we will need to allow someone to resolve (or choose) one or all? */}
      <Row>
        <Col md={8}>
          <h1 className="display-5 text-truncate">{dummyData?.name}</h1>
        </Col>
        <Col md={4}>
          <Stack direction="vertical">
            <h3 className="display-6 text-end mb-0 text-truncate">
              {dummyData?.discoveredLicenseTrace.license ||
                dummyData?.declaredLicense ||
                "No license found"}
              {licenseInfo && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={licenseInfo?.html_url}
                  id="license_info_link"
                >
                  <i className="ps-2 align-middle h6 bi bi-info-circle opacity-75"></i>
                </a>
              )}
            </h3>
            <span className="opacity-75 text-end">
              Confidence:{" "}
              <span className="txt-green">
                {dummyData?.discoveredLicenseTrace.confidence}
              </span>
            </span>
          </Stack>
        </Col>
      </Row>
      <br />

      <Row className="g-3">
        <Col xs={12} md={4}>
          <RegularCard title={"Version"} fadeIn minHeight="8vh" maxHeight="8vh">
            <h6>Semantic: {dummyData?.version || "Not found"}</h6>
            <h6>Original: UNAVAILABLE</h6>
          </RegularCard>
        </Col>
        <Col xs={12} md={8}>
          <RegularCard title={"Notice"} fadeIn minHeight="8vh" maxHeight="8vh">
            {/* TODO: list here with the notices of this specific package */}
            <h5 className="text-muted">All good!</h5>
          </RegularCard>
        </Col>

        {/* TODO: collapsed item with the tree in it.. */}
        {/* TODO: what about other information like the URL of the repo? */}

        <Col xs={12}>
          <RegularCard minHeight="50vh" title={"Dependencies"} fadeIn>
            <DependencyList
              dependencies={(
                Object.entries(dummyData?.dependencies || {}) || []
              )
                .filter((e) => e[1].kind === "DIRECT")
                .map(([depName, depInfo]) => {
                  return {
                    name: depName,
                    version: depInfo.version,
                    // TODO: change me to actual license
                    license: null,
                    compliance: ComplianceStatus.UNKNOWN,
                    link: `/scan-result/${depInfo.scans[depInfo.version]}`,
                  };
                })}
            />
          </RegularCard>
        </Col>
      </Row>
    </div>
  );
}
