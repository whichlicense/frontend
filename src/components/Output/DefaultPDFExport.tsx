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

import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useRef } from "react";
import RegularCard from "../Cards/RegularCard";
// @ts-ignore
import * as html2pdf from 'html2pdf.js';

export default function DefaultPDFExport() {
  // TODO: develop our own export pdf style for delivery

  const printRef = useRef<any>(undefined)

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const options = {
      margin: 10,
      filename: 'download.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div>
      <Button onClick={handleDownloadPdf}>
        Download as PDF
      </Button>

      <div ref={printRef} style={{
        backgroundColor: 'white',
        overflow: 'hidden',
      }}>
        <Row>
            <Col xs={6} className="bg-black">
                Hello
            </Col>
            <Col xs={6} className="bg-red">
                World
            </Col>
        </Row>
        <br />
        <Container>
            <ListGroup>
                <ListGroup.Item>Item 1</ListGroup.Item>
                <ListGroup.Item>Item 2</ListGroup.Item>
                <ListGroup.Item>Item 3</ListGroup.Item>
            </ListGroup>
            <br />
            <RegularCard title="Basic notifications" maxHeight="101%">
            <ListGroup>
                {Array.from({ length: 100 }).map((_, idx) => (
                <ListGroup.Item key={idx}>Item {idx}</ListGroup.Item>
                ))}
            </ListGroup>
            </RegularCard>
                        
        </Container>
      </div>
      
    </div>
  );
}
