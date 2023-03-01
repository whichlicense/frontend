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

import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import HBarChart from "../components/Charts/HBarChart";

export default function Dashboard() {
  return (
    <>
      <RegularCard
        title={<h1 className="display-6 text-dark">Information Bar.</h1>}
        bg="bg-purple"
        maxHeight="25vh"
        minHeight="25vh"
      >
        <HBarChart
          series={[
            {
              data: [
                {
                  x: "MIT",
                  y: 72,
                },
                {
                  x: "Apache 2.0",
                  y: 30,
                },
                {
                  x: "CC-BY-4.0",
                  y: 20,
                },
                {
                  x: "intel-acpi",
                  y: 20,
                },
                {
                  x: "gpl-2.0-plus",
                  y: 13,
                },
                {
                  x: "x",
                  y: 40,
                },
                {
                  x: "x",
                  y: 69,
                },
              ],
            },
          ]}
        />
      </RegularCard>

      <Row>
        <Col xs={12} md={6} className="g-3 d-flex align-items-stretch">
          <RegularCard title={"Projects"}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="align-self-center">
                    WhichLicense detection
                  </div>
                  <div className="align-self-baseline">
                    <Badge bg="secondary">Apache 2.0</Badge>
                  </div>
                </div>
                <hr className="text-muted" />
              </ListGroup.Item>
            </ListGroup>
          </RegularCard>
        </Col>

        <Col xs={12} md={6} className="g-3 d-flex align-items-stretch">
          <RegularCard title={"Notice"}>
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
          <RegularCard title={"Recent scans"} maxHeight="30vh">
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-dark-1 text-bg-dark">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>Scan 1</h5>
                  </div>
                  Jan 20, 2021
                  <div>
                    <Badge bg="danger">Non-compliant</Badge>
                  </div>
                </div>
                <hr className="text-muted" />
              </ListGroup.Item>

              {Array.from({ length: 3 }).map((_, idx) => (
                <ListGroup.Item className="bg-dark-1 text-bg-dark">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5>Scan {idx + 2}</h5>
                    </div>
                    Jan 20, 2021
                    <div>
                      <Badge bg="success">Compliant</Badge>
                    </div>
                  </div>
                  <hr className="text-muted" />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </RegularCard>
        </Col>
      </Row>
    </>
  );
}
