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

import { ListGroup, Row, Col, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { ComplianceStatus } from "../typings/DependencyStatus";

type ScanListProps = {
    scans: {
        name: string,
        date: string,
        status: ComplianceStatus
        link?: string
    }[]
}
export default function ScanList(props: ScanListProps){
    const navigate = useNavigate();


    const getBadge = (status: ComplianceStatus) => {
        switch(status){
            case ComplianceStatus.COMPLIANT:
                return <Badge className="bg-green txt-dark-1">Compliant</Badge>
            case ComplianceStatus.NON_COMPLIANT:
                return <Badge className="bg-red txt-dark-1">Incompliant</Badge>
            case ComplianceStatus.UNKNOWN:
                return <Badge className="bg-yellow txt-dark-1">Unknown</Badge>
            default:
                return <Badge bg="warning">N/A</Badge>
        }
    }

    return (
        <ListGroup variant="flush">
        {props.scans.map((scan, idx) => (
          <ListGroup.Item
            onClick={() => navigate("/scan-result/000")}
            className="bg-dark-1 text-bg-dark"
          >
            <Row>
              <Col xs={6}>
              <div>
                <h6>{scan.name}</h6>
              </div>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col xs={6} className="d-flex justify-content-end">
                    <h6>{scan.date}</h6>
                  </Col>
                  <Col xs={6} className="d-flex justify-content-end">
                    {getBadge(scan.status)}
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr className="text-muted" />
          </ListGroup.Item>
        ))}
      </ListGroup>
    )
}