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

import { Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { AuthState, useForceAuth } from "../components/Hooks/useForceAuth";
import { useToolBar } from "../components/Hooks/useToolBar";
import { ToolBarItemType } from "../context/ToolBarContext";

export default function Notifications() {
  useForceAuth({
    ifState: AuthState.LOGGED_OUT,
    travelTo: "/login",
  });

  useToolBar([
    {
      type: ToolBarItemType.BUTTON,
      title: "Save",
      // TODO: turn green or something when there's an item to save
      disabled: true,
      onClick: () => {},
    }
  ])
  // TODO: what to receive emails for? everything? have a list that they can toggle stuff on and off?
  // TODO: webhooks for what? everything? have a list that they can toggle stuff on and off?
  return (
    <div>
      <Stack gap={2}>
        <h6 className="display-6">Email notifications</h6>
        <small className="text-muted">
            Press the buttons after each input to enable or disable their
            functionality.
          </small>
        <RegularCard minHeight="100%" maxHeight="100%">
          <div>
            <InputGroup className="mb-3">
              <Form.Control placeholder="Email to" />
              <Button className="bg-green txt-dark-1">Enabled</Button>
            </InputGroup>
            <hr />
            <h4 className="mb-0">Conditions</h4>
            <small className="text-muted">Trigger conditions. an email will be sent for each type</small>
          <Row className="pt-3">
            <Col md={4}>
              <Form.Check type="checkbox" label="New scan initiated" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Scan completed" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Scan failed" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Scan requires attention" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Project compliancy change" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Report created" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Report deleted" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Sub account created" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Sub account changed" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Sub account deleted" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Project added" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Project removed" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Project information changed" />
            </Col>
          </Row>
          </div>
        </RegularCard>
        <RegularCard title="WebHook notifications">
          <InputGroup className="mb-3">
            <Form.Control placeholder="WebHook call url" />
            <Button className="bg-grey txt-white">Help</Button>
            <Button className="bg-red txt-dark-1">Disabled</Button>
          </InputGroup>
        </RegularCard>
      </Stack>
    </div>
  );
}
