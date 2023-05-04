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
import { useAuthContext } from "../context/AuthContext";
import { AuthState, useForceAuth } from "../components/Hooks/useForceAuth";

export default function Settings() {
  // TODO: delete account button in "account" section

  useForceAuth({
    ifState: AuthState.LOGGED_OUT,
    travelTo: "/login",
  })

  const {provider} = useProviderContext();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);

  const auth = useAuthContext();

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

  const onChangeEmailSubmit = async ( e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const current = data.get("current_email") as string;
    const newEmail = data.get("new_email") as string;
    const confirm = data.get("confirm_email") as string;

    if(current !== auth.user?.email){
      toast.error("Current email is incorrect");
      return;
    }

    if (newEmail !== confirm) {
      toast.error("Emails do not match");
      return;
    }

    provider.changeEmail(newEmail).then((res) => {
      toast.success("Email changed. Please verify your new email address and then login again.");
      setChangeEmailOpen(false);
      auth.logout();
    }).catch((err) => {
      toastError(err, "Failed to change email");
    });
  }

  return (
    <div>
      <SectionHeading title={"Account settings"} type="display" size={"4"} />
      <ButtonGroup>
        <Button onClick={()=>setChangePasswordOpen(true)}>Change Password</Button>
        <Button onClick={()=>setChangeEmailOpen(true)}>Change Email</Button>
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

      <InlineCard show={changeEmailOpen} handleClose={()=>setChangeEmailOpen(false)}>
        <Form onSubmit={onChangeEmailSubmit}>
          <Row>
            <Col xs={12}>
              <Form.Label htmlFor="current_email">
                Current email
              </Form.Label>
              <Form.Control
                type="email"
                id="current_email"
                name="current_email"
                aria-describedby="current_email"
              />
            </Col>

            <Col md={6}>
              <Form.Label htmlFor="new_email">New email</Form.Label>
              <Form.Control
                type="email"
                id="new_email"
                name="new_email"
                aria-describedby="new_email"
              />
            </Col>

            <Col md={6}>
              <Form.Label htmlFor="confirm_email">
                Confirm email
              </Form.Label>
              <Form.Control
                type="email"
                id="confirm_email"
                name="confirm_email"
                aria-describedby="confirm_email"
              />
            </Col>
          </Row>
          <br />
          <Button type="submit" className="bg-red">Change email</Button>
        </Form>
      </InlineCard>
    </div>
  );
}
