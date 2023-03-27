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

import { Button, Col, Row, Stack } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { AuthState, useForceAuth } from "../components/Hooks/useForceAuth";
import { useToolBar } from "../components/Hooks/useToolBar";
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
        // TODO: implement this
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
    </>
  );
}
