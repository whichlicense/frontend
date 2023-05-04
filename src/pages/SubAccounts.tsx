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

import { useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { AuthState, useForceAuth } from "../components/Hooks/useForceAuth";
import { useToolBar } from "../components/Hooks/useToolBar";
import { InlineCard } from "../components/Modals/InlineCard";
import SectionHeading from "../components/Typography/SectionHeading";
import { mapKey } from "../components/utils/mapKey";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import { ToolBarItemType } from "../context/ToolBarContext";
import { AccountPermissionsTable, AccountTable } from "../types/schema";
import ProviderMismatchHandler, {
  ProviderMismatchAction,
} from "../components/Provider/Rendering/ProviderMismatchHandler";
import { ProviderType } from "../components/Provider/Provider";
import { toast } from "react-toastify";
import { useProviderContext } from "../context/ProviderContext";

type TSubAccountAndPermissions = AccountTable & {
  permissions: Omit<Omit<AccountPermissionsTable, "id">, "account_id">;
};
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

  const {provider} = useProviderContext();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [subAccounts, setSubAccounts] = useState<TSubAccountAndPermissions[]>(
    []
  );
  const [domains, setDomains] = useState<
    { id: number; name: string; description: string }[]
  >([]);
  const [showAddSubAccountCard, setShowAddSubAccountCard] = useState(false);

  const getAvailablePermissions = async () => {
    await provider.getAvailableAccountPermissions().then((res) => {
      setPermissions(res);
    });
  };

  const getSubAccounts = async () => {
    await provider.getSubAccounts().then((res) => {
      setSubAccounts(res);
    })
  };

  const getDomains = async () => {
    await provider.getAccountDomains().then((res) => {
      setDomains(res);
    });
  };

  const onAddSubAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const first_name = data.get("first_name") as string;
    const last_name = data.get("last_name") as string;
    const domain = data.get("domain") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const perms = Object.fromEntries(
      permissions.map((permissionKey) => {
        return [permissionKey, (e.target as any)[permissionKey].checked];
      })
    );
    provider.addSubAccount({
      first_name,
      last_name,
      email,
      password,
      domain: parseInt(domain),
      permissions: perms
    })
      .then((res) => {
        setShowAddSubAccountCard(false);
        toast.success(res.message || "Sub account created successfully");

        getSubAccounts()
      })
      .catch((err) => {
        setShowAddSubAccountCard(false);
        toast.error(err.response.data.error || "An error occurred while attempting to add the sub account");
      });
  };

  useEffectOnce(() => {
    getAvailablePermissions();

    getSubAccounts();

    getDomains();
  });
  return (
    <ProviderMismatchHandler
      replacingComponent={
        <>
          <SectionHeading
            divider
            title={
              "Sub accounts are only available on our cloud hosted solution"
            }
            size={"5"}
            type="display"
          />
        </>
      }
      requiredProvider={ProviderType.CLOUD}
      action={ProviderMismatchAction.REPLACE}
    >
      <>
        <Stack gap={2}>
          <h1 className="display-5">Sub Accounts</h1>
          <hr />
          <Row>
            {subAccounts.map((subAccount, subAccountIdx) => (
              <Col md={6}>
                <RegularCard
                  title={`${subAccount.first_name} ${subAccount.last_name}`}
                  minHeight="22vh"
                  maxHeight="22vh"
                >
                  <Stack gap={1}>
                    <span>Email: {subAccount.email}</span>
                    <span>
                      Domain:{" "}
                      {domains.find((d) => d.id === subAccount.domain)?.name ||
                        "UNKNOWN"}
                    </span>
                    <h6>Permissions:</h6>
                    <Row xs={1} md={2} lg={3} xxl={5} className="g-2">
                      {Object.entries(subAccount.permissions).map(
                        ([k, v], i) => (
                          <Col key={`${subAccountIdx}_${k}_${v}_${i}`}>
                            <Button
                              className={`w-100 not-clickable bg-${
                                v ? "green" : "red"
                              } txt-dark-1`}
                            >
                              <small>{mapKey(k)}</small>
                            </Button>
                          </Col>
                        )
                      )}
                    </Row>
                  </Stack>
                </RegularCard>
              </Col>
            ))}
          </Row>
        </Stack>

        <InlineCard
          show={showAddSubAccountCard}
          handleClose={() => setShowAddSubAccountCard(false)}
        >
          <>
            <SectionHeading title={"Add sub account"} size={"1"} />
            <Form onSubmit={onAddSubAccount}>
              <Row>
                <Col md={5}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      First name<span className="txt-deep-red">*</span>
                    </Form.Label>
                    <Form.Control
                      name="first_name"
                      placeholder="Enter first name"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      name="last_name"
                      placeholder="(optional) Enter last name"
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Domain</Form.Label>
                    <Form.Select
                      name="domain"
                      placeholder="(optional) Enter last name"
                    >
                      {domains.map((domain) => {
                        return <option value={domain.id}>{domain.name}</option>;
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Email address<span className="txt-deep-red">*</span>
                    </Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Enter email"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Password<span className="txt-deep-red">*</span>
                    </Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <SectionHeading title={"Permissions"} size={"2"} divider />
              <Row xs={1} md={3} lg={4} xxl={5} className="g-2 pt-2">
                {permissions.map((permissionKey, i) => {
                  return (
                    <Col>
                      <Form.Group>
                        <Form.Check
                          name={permissionKey}
                          type="checkbox"
                          label={mapKey(permissionKey)}
                        />
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
    </ProviderMismatchHandler>
  );
}
