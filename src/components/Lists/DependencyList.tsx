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

import { ListGroup, Row, Col, Badge } from "react-bootstrap";
import { ComplianceStatus } from "../typings/DependencyStatus";

type DependencyListProps = {
  dependencies: {
    name: string;
    version?: string;
    license?: string;
    compliance?: ComplianceStatus;
  }[];
};
export default function DependencyList(props: DependencyListProps) {
  const complianceColor = (compliance?: ComplianceStatus) => {
    switch (compliance) {
      case ComplianceStatus.COMPLIANT:
        return "bg-green txt-dark-1";
      case ComplianceStatus.NON_COMPLIANT:
        return "bg-red";
      case ComplianceStatus.UNKNOWN:
        return "bg-grey";
      default:
        return "bg-grey";
    }
  };
  return (
    <ListGroup variant="flush">
      {props.dependencies.map((dep, idx) => (
        <ListGroup.Item className="ps-0">
          <Row>
            <Col xs={4}>
              <h6>{dep.name}</h6>
            </Col>
            <Col xs={4}>
              <span>{dep.version || "UNKNOWN"}</span>
            </Col>
            <Col xs={4}>
              {/* TODO: change color based on detected license? or absent? */}
              <Badge className={`${complianceColor(dep.compliance)} float-end`}>
                {/* TODO: tooltip with confidence */}
                <span>{dep.license || "UNKNOWN"}</span>
              </Badge>
            </Col>
          </Row>
          <hr className="text-muted" />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
