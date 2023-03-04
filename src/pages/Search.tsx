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

import { useEffect, useState } from "react";
import { InputGroup, Form, Row, Col, Stack, ListGroup } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { InlineCard } from "../components/Modals/InlineCard";
import { ToolBarItemType, useToolBarContext } from "../context/ToolBarContext";

export default function Search() {
  const { setItems } = useToolBarContext();
  const [depCardOpen, setDepCardOpen] = useState(false);
  const [filterCardOpen, setFilterCardOpen] = useState(false);
  useEffect(() => {
    setItems([
      {
        type: ToolBarItemType.INPUT,
        placeholder: "Search...",
        onChange: (value) => {},
      },
      {
        type: ToolBarItemType.BUTTON,
        title: "Filter",
        icon: "bi bi-filter",
        onClick: () => {
          setFilterCardOpen(true);
        },
      },
      {
        type: ToolBarItemType.SEPARATOR,
      },
      {
        type: ToolBarItemType.BUTTON,
        title: "New scan",
        icon: "bi bi-plus",
        onClick: () => {},
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <br />
      <div>
        <h6 className="display-6">3000 Dependencies scanned</h6>
        <small className="text-muted">
          Enter some information about the dependency you want to search for.
          Use the toolbar above to fine tune your search parameters.
        </small>
      </div>
      <br />
      <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="g-3">
        {Array.from({ length: 40 }).map((_, idx) => (
          <Col>
            <RegularCard
              minHeight="15vh"
              title={`Example ${idx}`}
              icon="bi bi-arrow-up-right-circle"
              iconColor="txt-purple"
              onCardClick={() => {
                setDepCardOpen(true);
              }}
            >
              <Stack gap={1}>
                <h6>Manager: NPM</h6>
                <h6>License: MIT
                  <i className="bi bi-question-circle txt-red ms-2"></i>
                </h6>
                <h6>Latest: 1.0.0</h6>
                <small className="text-muted">Last scan: Jan 20, 2023</small>
              </Stack>
            </RegularCard>
          </Col>
        ))}
      </Row>

      <InlineCard
        title="Dependency X"
        show={depCardOpen}
        handleClose={() => setDepCardOpen(false)}
      >
        <Stack>
          <h6>Manager: NPM</h6>
          <div className="d-flex justify-content-between">
            <h6>Version:</h6>
            <Form.Select>
              <option>1.0.0</option>
            </Form.Select>
          </div>
          <hr />
          <h5>License history</h5>
          <ListGroup variant="flush">
            <ListGroup.Item>0.0.1 - MIT</ListGroup.Item>
            <ListGroup.Item>0.0.2 - Apache 2.0</ListGroup.Item>
          </ListGroup>
        </Stack>
      </InlineCard>

      <InlineCard
        title="Filter"
        show={filterCardOpen}
        handleClose={() => setFilterCardOpen(false)}
      >
        <Row>
          <Col>
            <Form.Label htmlFor="package-manager-selection">
              Package manager
            </Form.Label>
            <Form.Select id="package-manager-selection">
              <option value="1">All</option>
              <option value="2">NPM</option>
              <option value="3">Maven</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Label htmlFor="license-selection">License</Form.Label>
            <Form.Select id="license-selection">
              <option value="1">All</option>
              <option value="2">MIT</option>
              <option value="3">Apache 2.0</option>
            </Form.Select>
          </Col>
          
        </Row>
      </InlineCard>
    </div>
  );
}
