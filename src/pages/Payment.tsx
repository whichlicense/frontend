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
import RevolutCheckout from "@revolut/checkout";
import axios from "axios";
import { useMemo, useState } from "react";
import { Button, Col, Row, Spinner, Stack, Table } from "react-bootstrap";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import RegularCard from "../components/Cards/RegularCard";
import { AuthState, useForceAuth } from "../components/Hooks/useForceAuth";
import { useToolBar } from "../components/Hooks/useToolBar";
import { InlineCard } from "../components/Modals/InlineCard";
import PlanUsageBar from "../components/ProgressBars/PlanUsageBar";
import SectionHeading from "../components/Typography/SectionHeading";
import { formatMinorPrice } from "../components/utils/currency";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import { CONFIG } from "../CONFIG";
import { useAuthContext } from "../context/AuthContext";
import { ToolBarItemType } from "../context/ToolBarContext";
import {
  OrderInventoryTable,
  PlanDetailsTable,
  TopUpOptionsTable,
} from "../types/schema";

/*
Change the address of the endpoints that you want to test from https://merchant.revolut.com/ 
to https://sandbox-merchant.revolut.com/.
Set the mode parameter to sandbox in the options of RevolutCheckout widget or Revolut Pay.
*/

type RevolutOrder = {
  id: string;
  public_id: string;
  type: string;
  state: string;
  created_date: string;
  updated_date: string;
  order_amount: {
    value: number;
    currency: string;
  };
  checkout_url: string;
};

export default function Payment() {
  useForceAuth({
    ifState: AuthState.LOGGED_OUT,
    travelTo: "/login",
  });
  useToolBar([
    {
      type: ToolBarItemType.BUTTON,
      title: "Change plan",
      bgColor: "bg-blue",
      txtColor: "txt-dark-1",
      icon: "bi bi-building-up",
      onClick: () => {
        setShowChangePlan(true);
      },
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Change payment details",
      icon: "bi bi-credit-card",
      onClick: () => {
        // TODO: implement

        console.log("Change plan");
      },
    },
  ]);
  const auth = useAuthContext();

  const [showChangePlan, setShowChangePlan] = useState(false);
  const [plans, setPlans] = useState<
    (PlanDetailsTable & Omit<OrderInventoryTable, "id">)[]
  >([]);
  const [topUpOptions, setTopUpOptions] = useState<
    (TopUpOptionsTable & Omit<OrderInventoryTable, "id">)[]
  >([]);

  const [paymentHistory, setPaymentHistory] = useState<
    {
      id: number;
      type: "PAYMENT" | "REFUND" | "CHARGEBACK";
      value: number;
      state:
        | "PENDING"
        | "PROCESSING"
        | "AUTHORISED"
        | "COMPLETED"
        | "CANCELLED"
        | "FAILED";
      created_date: string;
      checkout_url: string;
      description: string;
    }[]
  >([]);

  const userPlan = useMemo(() => {
    return plans.find((plan) => plan.id === auth.user?.plan.plan);
  }, [auth.user?.plan.plan, plans]);

  const REV_PUB_KEY = "pk_eH6pNsC0AwSw1Wf8aj4UlerSiY9HEN2ovV64vv0BI4RlAUNc";

  const getAvailablePlans = async () => {
    const res = await axios.get(`${CONFIG.gateway_url}/plans/get-all`);
    return res.data;
  };

  const getTopUpOptions = async () => {
    const res = await axios.get(`${CONFIG.gateway_url}/top-up/get-options`);
    return res.data;
  };

  const getPaymentHistory = async () => {
    const res = await axios.get(
      `${CONFIG.gateway_url}/payment/account-history`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    console.log(res.data);
    return res.data;
  };

  useEffectOnce(() => {
    getAvailablePlans().then((data) => {
      setPlans(data);
    });

    getTopUpOptions().then((data) => {
      setTopUpOptions(data);
    });

    getPaymentHistory().then((data) => {
      setPaymentHistory(data);
    });
  });

  const topUpOrder = async (topUpId: number) => {
    // TODO: conditionally use public url or localhost based on NPM environment
    return (await axios(`${CONFIG.gateway_url}/payment/top-up/${topUpId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => {
      return res.data;
    })) as Promise<RevolutOrder>;
  };

  const topUpCheckout = (topUpId: number) => {
    console.log("Checkout", topUpId);
    topUpOrder(topUpId).then((data) => {
      if (!data.public_id) return;
      // TODO: conditionally use sandbox or production based on NPM environment
      RevolutCheckout(data.public_id, "sandbox").then((instance) => {
        // work with instance
        instance.payWithPopup({
          onSuccess: () => {
            console.log("Payment success");
            // TODO: toast
            // TODO: update usage information by re-requesting from the server?
            auth.refresh();
          },
          // TODO: deal with errors
        });
        // TODO: deal with errors
      });
    });
  };
  return (
    <div>
      {/* <Button onClick={checkout}>Checkout</Button> */}
      <Row className="g-4">
        <Col xs={12} md={4}>
          <RegularCard bg="bg-purple" title="Usage" minHeight="20vh" maxHeight="20vh">
            <div>
              <small className="text-truncate">
                Remaining: {auth.user ? auth.user?.plan.leftover_minutes : 0}
              </small>
              <hr />
              <PlanUsageBar
                total_minutes={auth.user?.plan.total_minutes || 0}
                leftover_minutes={auth.user?.plan.leftover_minutes || 0}
              />
              <div className="d-flex justify-content-between">
                <small>{auth.user?.plan.leftover_minutes || 0} minutes</small>
                <small>
                  {auth.user ? auth.user?.plan.total_minutes : 0} minutes
                </small>
              </div>
            </div>
          </RegularCard>
        </Col>
        <Col xs={12} md={8}>
          <RegularCard title="Subscription" minHeight="20vh" maxHeight="20vh">
            <div>
              <h2 className="text-truncate display-6">Plan: Basic</h2>
              <h6>
                Cost per month:{" "}
                {userPlan?.price === null ? "N/A" : `€${userPlan?.price}`}
              </h6>
              <h6>Next billing date: N/A</h6>
            </div>
          </RegularCard>
        </Col>
        <Col xs={12}>
          <Stack gap={3}>
            <SectionHeading title="Top-up options" size="2" divider subtitle="Top-up in a pinch or choose to pay manually instead of a subscription" />

            <Row className="g-2">
              {topUpOptions.map((option) => (
                <Col xs={12} md={2}>
                  <RegularCard
                    title={`${option.minutes} minutes`}
                    minHeight="11vh"
                    maxHeight="11vh"
                    overflowY="hidden"
                  >
                    <h5>€{formatMinorPrice(option.price)}</h5>
                    <Button
                      onClick={() => {
                        topUpCheckout(option.id);
                      }}
                      className="w-100"
                    >
                      Buy
                    </Button>
                  </RegularCard>
                </Col>
              ))}
            </Row>
          </Stack>
        </Col>
        <Col xs={12}>
          <Stack gap={3}>
            <div>
            <SectionHeading title="Payment history" size="2" divider subtitle="Payment history entries are deleted after they are older than N days" />
              {paymentHistory.some((e)=>e.state === "PENDING") && (
                <small>
                <i className="txt-yellow bi bi-info-circle-fill pe-2"></i>Press
                on any{" "}
                <span className="btn not-clickable bg-yellow txt-dark-1">
                  pending
                </span>{" "}
                payment to manually complete it.
              </small>
              )}
            </div>

            <RegularCard minHeight="100%" maxHeight="100%">
              <Table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th className="d-flex align-content-end justify-content-end">
                      State
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => {
                    return (
                      <tr>
                        <td>{payment.description}</td>
                        <td>€{formatMinorPrice(payment.value)}</td>
                        <td>{new Date(payment.created_date).toISOString()}</td>
                        <td className="d-flex align-content-end justify-content-end">
                          {payment.state === "PENDING" && (
                            <a
                              className="btn bg-yellow txt-dark-1"
                              target="_blank"
                              rel="noreferrer"
                              href={payment.checkout_url}
                            >
                              Pending
                            </a>
                          )}
                          {payment.state === "AUTHORISED" && (
                            <Button
                              className="bg-blue"
                              onClick={() => window.open(payment.checkout_url)}
                            >
                              Authorized
                            </Button>
                          )}
                          {payment.state === "PROCESSING" && (
                            <Button className="bg-grey txt-white disabled">
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2 txt-white"
                              />
                              Processing
                            </Button>
                          )}
                          {payment.state === "CANCELLED" && (
                            <Button className="disabled bg-red txt-dark-1">
                              Cancelled
                            </Button>
                          )}
                          {payment.state === "FAILED" && (
                            <Button className="disabled bg-red txt-dark-1">
                              Failed
                            </Button>
                          )}
                          {payment.state === "COMPLETED" && (
                            <Button className="bg-green txt-dark-1 disabled">
                              Completed
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </RegularCard>
          </Stack>
        </Col>
      </Row>

      <InlineCard
        title="Change plan"
        show={showChangePlan}
        handleClose={() => setShowChangePlan(false)}
      >
        <>
          <Row>
            {plans
              .filter((p) => p.available)
              .map((plan) => {
                const isCurrentPlan = auth.user?.plan.plan === plan.id;
                return (
                  <Col xs={12} md={6}>
                    <RegularCard
                      title={`Basic ${isCurrentPlan ? "(current)" : ""}`}
                      minHeight="35vh"
                      maxHeight="30vh"
                      bg={isCurrentPlan ? "bg-blue" : undefined}
                    >
                      <div>
                        <h2 className="text-truncate display-6">
                          Plan: {plan.name}
                        </h2>
                        <h6>
                          Cost per month:{" "}
                          {plan.price === null ? "N/A" : `€${plan.price}`}
                        </h6>
                        <hr />
                        <h6>Description:</h6>
                        <ReactMarkdown>{plan.description}</ReactMarkdown>
                      </div>
                    </RegularCard>
                  </Col>
                );
              })}
          </Row>
        </>
      </InlineCard>
    </div>
  );
}
