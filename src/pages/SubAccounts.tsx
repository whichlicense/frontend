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

import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { AuthState, useForceAuth } from "../components/Hooks/useForceAuth";
import { useToolBar } from "../components/Hooks/useToolBar";
import { InlineCard } from "../components/Modals/InlineCard";
import SectionHeading from "../components/Typography/SectionHeading";
import { mapKey } from "../components/utils/mapKey";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import { CONFIG } from "../CONFIG";
import { ToolBarItemType } from "../context/ToolBarContext";

export default function SubAccounts() {
  useForceAuth({
    ifState: AuthState.LOGGED_OUT,
    travelTo: "/login",
  });

  useToolBar([
    {
      type: ToolBarItemType.BUTTON,
      title: "Add sub account",
      icon: "bi bi-person-add",
      onClick: () => {
        setShowAddSubAccountCard(true);
      },
    },
    {
      type: ToolBarItemType.SEPARATOR,
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Edit sub account",
      icon: "bi bi-pen",
      onClick: () => {
        // TODO: implement this
      },
    },
  ]);

  const [permissions, setPermissions] = useState<string[]>([]);
  const [showAddSubAccountCard, setShowAddSubAccountCard] = useState(false);

  const getAvailablePermissions = async () => {
    return (await axios.get(`${CONFIG.gateway_url}/settings/get-available-permissions`)).data as string[];
  }

  useEffectOnce(() => {
    getAvailablePermissions().then((res) => {
      console.log(res);
      setPermissions(res);
    });
  });
  return (
    <>
      <Stack gap={2}>
        <h1 className="display-5">Sub Accounts</h1>
        <hr />
        <Row>
          <Col md={6}>
            <RegularCard title="John Doe" minHeight="22vh" maxHeight="22vh">
              <Stack gap={1}>
                <p>Email: example@example.com</p>
                <h6>Permissions:</h6>
                <Row xs={1} md={2} lg={3} xxl={5} className="g-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Col>
                      <Button className="w-100 not-clickable bg-green txt-dark-1">
                        <small>Perm example {i}</small>
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Stack>
            </RegularCard>
          </Col>
          <Col md={6}>
            <RegularCard title="John Doe" minHeight="22vh" maxHeight="22vh">
              <Stack gap={1}>
                <p>Email: example@example.com</p>
                <h6>Permissions:</h6>
                <Row xs={1} md={2} lg={3} xxl={5} className="g-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Col>
                      <Button className="w-100 not-clickable bg-green txt-dark-1">
                        <small>Perm example {i}</small>
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Stack>
            </RegularCard>
          </Col>
        </Row>
      </Stack>

      <InlineCard show={showAddSubAccountCard} handleClose={()=>setShowAddSubAccountCard(false)}>
        <>
          <SectionHeading title={"Add sub account"} size={"1"} />
          <Form onSubmit={(e)=> {
            e.preventDefault();
            Object.entries(e.target).forEach(([key, value]) => {
              console.log(key, value);
            });
            console.log(e)
          }}>
            <Row xs={1} md={2}>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    First name<span className="txt-deep-red">*</span>
                  </Form.Label>
                  <Form.Control placeholder="Enter first name" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control placeholder="(optional) Enter last name" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                Email address<span className="txt-deep-red">*</span>
              </Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Password<span className="txt-deep-red">*</span>
              </Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <SectionHeading title={"Permissions"} size={"2"} divider />
            <Row xs={1} md={3} lg={4} xxl={5} className="g-2 pt-2">
              {permissions.map((permissionKey, i) => {
                return (
                  <Col>
                    <Form.Group>
                      <Form.Check name={permissionKey} type="checkbox" label={mapKey(permissionKey)} />
                    </Form.Group>
                  </Col>
                );
              })}
            </Row>

            <br />
            <Button className="bg-blue txt-dark-1" type="submit">
              Add account
            </Button>
          </Form>
        </>
      </InlineCard>
    </>
  );
}
