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

import { InputGroup, Form, Row, Col, Stack } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";

export default function Search() {
  return (
    <div>
      <RegularCard>
        {/* TODO: maybe put this in the toolbar? */}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="email" placeholder="Search..." />
          <Form.Text className="text-muted">
            Enter some information about the dependency you want to search for.
            Use the toolbar above to fine tune your search parameters.
          </Form.Text>
        </Form.Group>
      </RegularCard>

      <br />

      <Row xs={1} md={3} lg={4} xl={5} xxl={7} className="g-3">
        {Array.from({ length: 40 }).map((_, idx) => (
          <Col>
            <RegularCard
              title={`Example ${idx}`}
              icon="bi bi-arrow-up-right-circle"
              iconColor="txt-purple"
              onCardClick={() => {
                console.log("clicked");
              }}
            >
              <Stack gap={2}>
                <h6>Manager: NPM</h6>
                <small>Last scan: Jan 20, 2023</small>
                <small>Scanned version: 2.1.0</small>
              </Stack>
            </RegularCard>
          </Col>
        ))}
      </Row>
    </div>
  );
}
