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
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import SectionHeading from "../components/Typography/SectionHeading";
import { InlineCard } from "../components/Modals/InlineCard";
import { toast } from "react-toastify";
import { useState } from "react";
import { useProviderContext } from "../context/ProviderContext";
import { toastError } from "../components/utils/toasting";
import { useAuthContext } from "../context/AuthContext";
import { ProviderType } from "../components/Provider/Provider";
import ProviderMismatchHandler, {
  ProviderMismatchAction,
} from "../components/Provider/Rendering/ProviderMismatchHandler";
import { useToolBar } from "../components/Hooks/useToolBar";
import { ToolBarItemType } from "../context/ToolBarContext";
import { LocalProvider } from "../components/Provider/LocalProvider";

export default function Settings() {
  // TODO: delete account button in "account" section

  const { provider, setProvider } = useProviderContext();
  const [requestServerSettings, setRequestServerSettings] = useState({
    host: "localhost",
    port: 8080,
    secure: false,
    changed: false,
  });

  useToolBar([
    {
      type: ToolBarItemType.BUTTON,
      title: "Save connection settings",
      icon: "bi bi-save",
      onClick: () => {
        setProvider(
          new LocalProvider({
            host: requestServerSettings.host,
            port: requestServerSettings.port,
            secure: requestServerSettings.secure,
          })
        );
      },
      bgColor: "bg-blue",
      txtColor: "txt-dark-1",
    },
  ]);

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

    provider
      .changePassword(current, newPass)
      .then((res) => {
        toast.success("Password changed");
        setChangePasswordOpen(false);
      })
      .catch((err) => {
        toastError(err, "Failed to change password");
      });
  };

  const onChangeEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const current = data.get("current_email") as string;
    const newEmail = data.get("new_email") as string;
    const confirm = data.get("confirm_email") as string;

    if (current !== auth.user?.email) {
      toast.error("Current email is incorrect");
      return;
    }

    if (newEmail !== confirm) {
      toast.error("Emails do not match");
      return;
    }

    provider
      .changeEmail(newEmail)
      .then((res) => {
        toast.success(
          "Email changed. Please verify your new email address and then login again."
        );
        setChangeEmailOpen(false);
        auth.logout();
      })
      .catch((err) => {
        toastError(err, "Failed to change email");
      });
  };

  return (
    <div>
      <ProviderMismatchHandler
        action={ProviderMismatchAction.HIDE}
        requiredProvider={ProviderType.CLOUD}
      >
        <>
          {auth.isLoggedIn() && (
            <>
              <SectionHeading
                title={"Account settings"}
                type="display"
                size={"4"}
              />
              <ButtonGroup>
                <Button onClick={() => setChangePasswordOpen(true)}>
                  Change Password
                </Button>
                <Button onClick={() => setChangeEmailOpen(true)}>
                  Change Email
                </Button>
              </ButtonGroup>
              <br />
              <hr className="text-muted" />
              <p>More coming soon</p>

              <InlineCard
                show={changePasswordOpen}
                handleClose={() => setChangePasswordOpen(false)}
              >
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
                      <Form.Label htmlFor="new_password">
                        New password
                      </Form.Label>
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
                  <Button type="submit" className="bg-red">
                    Change password
                  </Button>
                </Form>
              </InlineCard>

              <InlineCard
                show={changeEmailOpen}
                handleClose={() => setChangeEmailOpen(false)}
              >
                <>
                  <small className="txt-yellow">
                    <i className="txt-yellow pe-2 bi bi-exclamation-triangle-fill"></i>
                    Please be aware that this action will log you out of your
                    account. In addition to this, you will be forced to confirm
                    the newly added email and will not be able to login until
                    you do so. If you're locked out of your account by this
                    action, please contact us via email.
                  </small>
                  <hr />
                  <br />
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
                    <Button type="submit" className="bg-blue txt-dark-1">
                      Change email
                    </Button>
                  </Form>
                </>
              </InlineCard>
            </>
          )}
        </>
      </ProviderMismatchHandler>

      <SectionHeading title={"App settings"} type="display" size={"4"} />
      <SectionHeading
        title={"Connection settings"}
        type="h"
        size={"4"}
        divider
        breakBottom
      />
      <Row className="bg-button-light txt-white simple-border rounded p-2 mx-2">
        <Col xs={12} lg={2}>
          <Button className="not-clickable">Server connection</Button>
        </Col>
        <Col xs={12} lg={1}>
          <DropdownButton
            title={requestServerSettings.secure ? "https://" : "http://"}
          >
            <Dropdown.Item
              onClick={() => {
                setRequestServerSettings({
                  ...requestServerSettings,
                  secure: false,
                  changed: true,
                });
              }}
            >
              http://
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setRequestServerSettings({
                  ...requestServerSettings,
                  secure: true,
                  changed: true,
                });
              }}
            >
              https://
            </Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col xs={12} lg={6}>
          <Form.Control
            className="txt-white bg-transparent border-0"
            defaultValue={requestServerSettings.host}
            onChange={(e) => {
              setRequestServerSettings({
                ...requestServerSettings,
                host: e.target.value,
                changed: true,
              });
            }}
          />
        </Col>
        <Col xs={12} lg={1}>
          <Button className="not-clickable">Port</Button>
        </Col>
        <Col xs={12} lg={2}>
          <Form.Control
            className="txt-white bg-transparent border-0"
            defaultValue={requestServerSettings.port}
            onChange={(e) => {
              setRequestServerSettings({
                ...requestServerSettings,
                host: e.target.value,
                changed: true,
              });
            }}
          />
        </Col>
      </Row>
    </div>
  );
}
