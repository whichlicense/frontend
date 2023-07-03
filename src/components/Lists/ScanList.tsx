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

import {
  ListGroup,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ComplianceStatus } from "../typings/DependencyStatus";
import { formatMinorPrice } from "../utils/currency";

type ScanListProps = {
  scans: {
    name: string;
    date: Date;
    status: ComplianceStatus;
    license: string;
    ecosystem: string[];
    link?: string;
  }[];
};
export default function ScanList(props: ScanListProps) {
  const navigate = useNavigate();

  // TODO: format date into viewer's format using Intl

  const getBadge = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.COMPLIANT:
        return <Badge className="bg-green txt-dark-1">Compliant</Badge>;
      case ComplianceStatus.NON_COMPLIANT:
        return <Badge className="bg-red txt-dark-1">Incompliant</Badge>;
      case ComplianceStatus.UNKNOWN:
        return <Badge className="bg-yellow txt-dark-1">Unknown</Badge>;
      default:
        return <Badge bg="warning">N/A</Badge>;
    }
  };

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>License</th>
          <th>Ecosystem</th>
          <th>Date</th>
          <th className="text-end">Status</th>
        </tr>
      </thead>
      <tbody>
        {props.scans.map((scan) => {
          return (
            <tr onClick={()=>{scan.link && navigate(scan.link)}}>
              <td className="align-middle">{scan.name}</td>
              <td className="align-middle">{scan.license}</td>
              <td className="align-middle">{scan.ecosystem.length > 1 ? "MULTIPLE" : scan.ecosystem[0]}</td>
              <td className="align-middle">{scan.date.toISOString()}</td>
              <td className="text-end">{getBadge(scan.status)}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
