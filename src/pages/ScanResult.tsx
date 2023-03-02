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

import { Badge, Breadcrumb, Button, Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import RegularCard from "../components/Cards/RegularCard";

export default function ScanResult() {
  let { id } = useParams();
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h1>Colors.js</h1>
        <div style={{ maxWidth: "50%" }}>
          {/* TODO: we need a component for this but i dont know how the data will look yet */}
          <Breadcrumb>
            <Breadcrumb.Item>
              <Badge className="bg-blue">WhichLicense detection</Badge>
            </Breadcrumb.Item>
            {Array.from({ length: 3 }, (_, i) => i).map((i) => (
              <Breadcrumb.Item key={i}>
                <Badge className="bg-blue">dependency {i}</Badge>
              </Breadcrumb.Item>
            ))}
            <Breadcrumb.Item>
              <Badge className="bg-grey">Colors.js</Badge>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      {/* TODO: show if there is a "back" */}

      <Row className="g-3">
        <Col>
          <Row xs={1} md={6} className="g-3">
              <Col>
                <RegularCard title={"License"}>
                <h4 className="display-6 txt-purple">MIT</h4>
                </RegularCard>
              </Col>
              <Col>
                <RegularCard title={"Version"}>
                    <h5>V2.0.5</h5>
                </RegularCard>
              </Col>
              <Col>
                <RegularCard title={"Scanned"}>
                    <h5>January 20, 2023 @ 23:00:02</h5>
                </RegularCard>
              </Col>
          </Row>
        </Col>
        {/* <Col xs={6}>
            <RegularCard title={"Chart???"} minHeight="20vh">
                <p>TODO: figure out what to show here</p>
            </RegularCard>
        </Col> */}

        <Col xs={12}>
          <RegularCard minHeight="50vh" title={"Dependencies"}>
            <p>TODO: show dependencies</p>
          </RegularCard>
        </Col>
      </Row>
    </div>
  );
}
