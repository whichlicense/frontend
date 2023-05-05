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
import { useMemo, useRef, useState } from "react";
import { useProviderContext } from "../context/ProviderContext";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import { TEmailNotificationSettings } from "../components/typings/EmailNotificationSettings";
import { toastResult } from "../components/utils/toasting";
import { useLocaleContext } from "../context/LocaleContext";

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
      disabled: false,
      onClick: () => {
        // fix for some weird pointer-degradation-like shenanigans here (i.e., we can't call 'onEmailConditionsChangeSubmit' directly).
        document.getElementById("submit_email_settings")?.click();
      },
    },
  ]);

  const { provider } = useProviderContext();
  const { resolve } = useLocaleContext();

  const [emailConditions, setEmailConditions] =
    useState<TEmailNotificationSettings>({} as any);
  useEffectOnce(() => {
      provider.getEmailNotificationSettings().then(setEmailConditions);
  });

  const emailFormRef = useRef<HTMLFormElement>(null);

  

  const emailTriggerConditions = useMemo(
    () => Object.entries(emailConditions).filter((e) => e[0].startsWith("on_")),
    [emailConditions]
  );

  const onEmailConditionsChangeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toastResult(provider.saveEmailNotificationSettings(emailConditions));
  };

  return (
    <div>
      <Stack gap={2}>
        <h6 className="display-6">Email notifications</h6>
        <small className="text-muted">
          Press the buttons after each input to enable or disable their
          functionality.
        </small>
        <RegularCard minHeight="100%" maxHeight="100%">
          <Form ref={emailFormRef} onSubmit={onEmailConditionsChangeSubmit}>
            <Button className="visually-hidden" type="submit" id="submit_email_settings"></Button>
            <InputGroup className="mb-3">
              <Form.Control
                defaultValue={emailConditions.email_to || undefined}
                placeholder="Email to"
                name="email_to"
                type="email"
                onChange={(e) => {
                  setEmailConditions((prev) => ({
                    ...prev,
                    email_to: e.target.value,
                  } as any));
                }}
              />
              <Button onClick={()=>{
                setEmailConditions((prev) => ({
                  ...prev,
                  enabled: !!!emailConditions.enabled,
                } as any));
              }} className={emailConditions.enabled ? "bg-green txt-dark-1" : "bg-red txt-dark-1" }>{
                emailConditions.enabled ? "Enabled" : "Disabled"
              }</Button>
            </InputGroup>
            <hr />
            <h4 className="mb-0">Conditions</h4>
            <small className="text-muted">
              Trigger conditions. an email will be sent for each type
            </small>
            <Row className="pt-3">
              {Object.keys(emailConditions).length < 2 && (
                <Col md={12}>
                  <div className="text-muted">Loading...</div>
                </Col>
              )}
              {emailTriggerConditions.map(([key, condition]) => {
                return (
                  <Col md={4}>
                    <Form.Check
                      name={key}
                      type="checkbox"
                      label={resolve(key).text}
                      checked={!!condition}
                      onChange={(e) => {
                        setEmailConditions((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }));
                      }}
                    />
                  </Col>
                );
              })}
            </Row>
          </Form>
        </RegularCard>
        <RegularCard title="WebHook notifications">
          <div>Coming soon</div>
          {/* <InputGroup className="mb-3">
            <Form.Control placeholder="WebHook call url" />
            <Button className="bg-red txt-dark-1">Disabled</Button>
          </InputGroup> */}
        </RegularCard>
      </Stack>
    </div>
  );
}
