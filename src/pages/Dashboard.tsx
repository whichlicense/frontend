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

import { useState } from "react";
import {
  Badge,
  Col,
  ListGroup,
  Row,
  Stack,
} from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { GoogleTreeMapChart } from "../components/Charts/GoogleTreeMapChart";
import { useForceAuth, AuthState } from "../components/Hooks/useForceAuth";
import { useToolBar } from "../components/Hooks/useToolBar";
import ScanList from "../components/Lists/ScanList";
import AddProjectCard from "../components/Modals/AddProject";
import { ProviderType } from "../components/Provider/Provider";
import ProviderMismatchHandler, {
  ProviderMismatchAction,
} from "../components/Provider/Rendering/ProviderMismatchHandler";
import { ComplianceStatus } from "../components/typings/DependencyStatus";
import SectionHeading from "../components/Typography/SectionHeading";
import { useProviderContext } from "../context/ProviderContext";
import { ToolBarItemType } from "../context/ToolBarContext";
import { TDummyData } from "../types/dummy";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import axios from "axios";
import { CONFIG } from "../CONFIG";
import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
  useForceAuth({
    ifState: AuthState.LOGGED_OUT,
    travelTo: "/login",
  });
  const { getProviderType } = useProviderContext();
  useToolBar([
    {
      type: ToolBarItemType.BUTTON,
      title: "Add Project",
      icon: "bi bi-plus-circle",
      hidden: getProviderType() === ProviderType.LOCAL,
      onClick: () => {
        setShowAddProject(true);
      },
    },
    {
      type: ToolBarItemType.SEPARATOR,
      hidden: getProviderType() === ProviderType.LOCAL,
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Scan A Project",
      icon: "bi bi-cpu",
      onClick: () => {
        console.log("button clicked");
      },
    },
  ]);
  const auth = useAuthContext();

  const [showAddProject, setShowAddProject] = useState(false);
  const [dummyData, setDummyData] = useState<{
    name: string,
    version: string,
    license: string,
    ecosystem: string,
    generated: number,
    dependencyAmount: number,
  }[]>()

  useEffectOnce(()=>{
    // TODO: this needs to be attached to the provider as the calls might change depending on the provider being used...
    axios.get(`${CONFIG.gateway_url}/scan/personal-scans`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    }).then((res)=>{
      setDummyData(res.data)
      console.log(res.data)
    })
  })

  return (
    <>
      <Row>
        <Col xs={12} className="g-3 d-flex align-items-stretch">
          <Stack>
            <div className="ps-2">
              <SectionHeading
                title="Package exposure"
                size="6"
                type="display"
              />
            </div>
            <GoogleTreeMapChart
              resizableContainerId="nav-content-section"
              bg="bg-section"
              data={[
                ["Global", null, 0],
                ["America", "Global", 0],
                ["Europe", "Global", 0],
                ["Asia", "Global", 0],
                ["Australia", "Global", 0],
                ["Africa", "Global", 0],
                ["Brazil", "America", 11],
                ["USA", "America", 52],
                ["Mexico", "America", 24],
                ["Canada", "America", 16],
                ["France", "Europe", 42],
                ["Germany", "Europe", 31],
                ["Sweden", "Europe", 22],
                ["Italy", "Europe", 17],
                ["UK", "Europe", 21],
                ["China", "Asia", 36],
                ["Japan", "Asia", 20],
                ["India", "Asia", 400],
                ["Laos", "Asia", 4],
                ["Mongolia", "Asia", 1],
                ["Israel", "Asia", 12],
                ["Iran", "Asia", 18],
                ["Pakistan", "Asia", 11],
                ["Egypt", "Africa", 21],
                ["S. Africa", "Africa", 30],
                ["Sudan", "Africa", 12],
                ["Congo", "Africa", 10],
                ["Zaire", "Africa", 8],
              ]}
            />
          </Stack>
        </Col>

        <Col xs={12} md={6} className="g-3 d-flex align-items-stretch">
          <ProviderMismatchHandler
            replacingComponent={
              <RegularCard className="bg-striped" title={"Projects"} fadeIn>
                <div className="text-muted">
                  <h5>Not available</h5>
                  <small>
                    This feature is only available in our cloud hosted solution
                  </small>
                </div>
              </RegularCard>
            }
            requiredProvider={ProviderType.CLOUD}
            action={ProviderMismatchAction.REPLACE}
          >
            <RegularCard title={"Projects"} fadeIn>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Stack
                    direction="horizontal"
                    className="d-flex justify-content-between align-items-start"
                    onClick={() => {
                      console.log("ss");
                    }}
                  >
                    <div className="align-self-center h5">
                      <i className="bi bi-github pe-3"></i>WhichLicense
                      detection
                    </div>
                    <div className="align-self-baseline">
                      <Badge bg="secondary">Apache 2.0</Badge>
                    </div>
                  </Stack>
                  <hr className="text-muted" />
                </ListGroup.Item>
              </ListGroup>
            </RegularCard>
          </ProviderMismatchHandler>
        </Col>

        <Col xs={12} md={6} className="g-3 d-flex align-items-stretch">
          <RegularCard title={"Notice"} fadeIn>
            <ListGroup variant="flush">
              {Array.from({ length: 5 }).map((_, idx) => (
                <ListGroup.Item>
                  <i className="bi bi-exclamation-circle"></i> Project {idx + 1}{" "}
                  has unresolved licenses.
                </ListGroup.Item>
              ))}
            </ListGroup>
          </RegularCard>
        </Col>

        <Col xs={12} className="g-3">
          <RegularCard title={"Recent scans"} maxHeight="30vh" fadeIn>
            <ScanList
              scans={dummyData?.map((scan) => {
                return {
                  name: scan.name,
                  date: new Date(scan.generated * 1000),
                  license: scan.license,
                  ecosystem: scan.ecosystem,
                  status: ComplianceStatus.UNKNOWN,
                  link: `/scan-result/${scan.name}`
                }
              }) || []}
            />
          </RegularCard>
        </Col>
      </Row>

      <AddProjectCard show={showAddProject} handleClose={()=>setShowAddProject(false)} />
    </>
  );
}
