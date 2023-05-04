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
  Button,
  ButtonGroup,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import SectionHeading from "../components/Typography/SectionHeading";
import { InlineCard } from "../components/Modals/InlineCard";
import { toast } from "react-toastify";
import { useState } from "react";
import { useProviderContext } from "../context/ProviderContext";
import { toastError } from "../components/utils/toasting";

export default function Settings() {
  // TODO: delete account button in "account" section

  const {provider} = useProviderContext();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const onChangePasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const current = data.get("current_password") as string;
    const newPass = data.get("new_password") as string;
    const confirm = data.get("confirm_password") as string;

    if (newPass !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    provider.changePassword(current, newPass).then((res) => {
      toast.success("Password changed");
      setChangePasswordOpen(false);
    }).catch((err) => {
      toastError(err, "Failed to change password");
    });
  };

  return (
    <div>
      <SectionHeading title={"Account settings"} type="display" size={"4"} />
      <ButtonGroup>
        <Button onClick={()=>setChangePasswordOpen(true)}>Change Password</Button>
        <Button>Change Email</Button>
      </ButtonGroup>
      <br />
      <hr className="text-muted" />
      <p>More coming soon</p>

      <InlineCard show={changePasswordOpen} handleClose={()=>setChangePasswordOpen(false)}>
        <Form onSubmit={onChangePasswordSubmit}>
          <Row>
            <Col xs={12}>
              <Form.Label htmlFor="current_password">
                Current password
              </Form.Label>
              <Form.Control
                type="password"
                id="current_password"
                name="current_password"
                aria-describedby="current_password"
              />
            </Col>

            <Col md={6}>
              <Form.Label htmlFor="new_password">New password</Form.Label>
              <Form.Control
                type="password"
                id="new_password"
                name="new_password"
                aria-describedby="new_password"
              />
            </Col>

            <Col md={6}>
              <Form.Label htmlFor="confirm_password">
                Confirm password
              </Form.Label>
              <Form.Control
                type="password"
                id="confirm_password"
                name="confirm_password"
                aria-describedby="confirm_password"
              />
            </Col>
          </Row>
          <br />
          <Button type="submit" className="bg-red">Change password</Button>
        </Form>
      </InlineCard>
    </div>
  );
}
