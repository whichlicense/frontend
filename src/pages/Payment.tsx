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
import { useState } from "react";
import { Button, Col, ProgressBar, Row, Stack } from "react-bootstrap";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import RegularCard from "../components/Cards/RegularCard";
import { AuthState, useForceAuth } from "../components/Hooks/useForceAuth";
import { useToolBar } from "../components/Hooks/useToolBar";
import { InlineCard } from "../components/Modals/InlineCard";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import { CONFIG } from "../CONFIG";
import { useAuthContext } from "../context/AuthContext";
import { ToolBarItemType } from "../context/ToolBarContext";
import { PlanDetailsTable } from "../types/plan";

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
  const [plans, setPlans] = useState<PlanDetailsTable[]>([]);

  const TOP_UP_OPTIONS = [
    {
      title: "5 minutes",
      id: "top-up-5",
      price: 2.5,
    },
    {
      title: "10 minutes",
      id: "top-up-10",
      price: 5,
    },
    {
      title: "15 minutes",
      id: "top-up-15",
      price: 7.5,
    },
    {
      title: "20 minutes",
      id: "top-up-20",
      price: 10,
    },
    {
      title: "25 minutes",
      id: "top-up-25",
      price: 12.5,
    },
    {
      title: "30 minutes",
      id: "top-up-30",
      price: 15,
    },
  ];

  const REV_PUB_KEY = "pk_eH6pNsC0AwSw1Wf8aj4UlerSiY9HEN2ovV64vv0BI4RlAUNc";

  const getAvailablePlans = async () => {
    const res = await axios.get(`${CONFIG.gateway_url}/plans/get-all`);
    return res.data;
  };

  useEffectOnce(() => {
    getAvailablePlans().then((data) => {
      setPlans(data);
    });
  });

  const createOrder = async () => {
    // TODO: conditionally use public url or localhost based on NPM environment
    return (await fetch(`${CONFIG.gateway_url}/create-payment-order`).then(
      (res) => {
        return res.json();
      }
    )) as Promise<RevolutOrder>;
  };

  const checkout = (orderId: string) => {
    createOrder().then((data) => {
      if (!data.public_id) return;
      // TODO: conditionally use sandbox or production based on NPM environment
      RevolutCheckout(data.public_id, "sandbox").then((instance) => {
        // work with instance
        instance.payWithPopup({
          onSuccess: () => {
            console.log("Payment success");
            // TODO: toast
            // TODO: update usage information by re-requesting from the server?
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
        <Col xs={12} md={6}>
          <RegularCard title="Usage" minHeight="20vh" maxHeight="20vh">
            <div>
              <small className="text-truncate">
                Remaining:{" "}
                {auth.user
                  ? auth.user?.plan.total_minutes -
                    auth.user?.plan.leftover_minutes
                  : 0}
              </small>
              <hr />
              <ProgressBar>
                <ProgressBar
                  className="bg-yellow"
                  striped
                  variant="warning"
                  now={auth.user?.plan.leftover_minutes || 0}
                  key={1}
                />
                <ProgressBar
                  className="bg-blue"
                  striped
                  variant="info"
                  now={
                    auth.user
                      ? auth.user?.plan.total_minutes -
                        auth.user?.plan.leftover_minutes
                      : 0
                  }
                  key={2}
                />
              </ProgressBar>
              <div className="d-flex justify-content-between">
                <small>{auth.user?.plan.leftover_minutes || 0} minutes</small>
                <small>
                  {auth.user ? auth.user?.plan.total_minutes : 0} minutes
                </small>
              </div>
            </div>
          </RegularCard>
        </Col>
        <Col xs={12} md={6}>
          <RegularCard title="Subscription" minHeight="20vh" maxHeight="20vh">
            <div>
              <h2 className="text-truncate display-6">Plan: Basic</h2>
              <h6>Cost per month: N/A {/** €3.00 */}</h6>
              <h6>Next billing date: N/A</h6>
            </div>
          </RegularCard>
        </Col>
        <Col xs={12}>
          <hr />
          <Stack gap={3}>
            <div>
              <h2 className="mb-0">Top-up options</h2>
              <small className="text-muted">
                Top-up in a pinch or choose to pay manually instead of a
                subscription
              </small>
            </div>

            <Row className="g-2">
              {TOP_UP_OPTIONS.map((option) => (
                <Col xs={12} md={2}>
                  <RegularCard
                    title={option.title}
                    minHeight="11vh"
                    maxHeight="11vh"
                    overflowY="hidden"
                  >
                    <h5>€{option.price}</h5>
                    <Button
                      onClick={() => {
                        checkout(option.id);
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
                        <h6>Cost per month: {plan.price_per_month || "N/A"}</h6>
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
