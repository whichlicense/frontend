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
  SavedPaymentMethodsTable,
  TopUpOptionsTable,
} from "../types/schema";
import { useSignal } from "../components/Hooks/useSignal";
import { ESignalType, Provider } from "../components/Provider/Provider";
import { toast } from "react-toastify";
import { CloudProvider } from "../components/Provider/CloudProvider";

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
      title: "Add/Change default payment method",
      icon: "bi bi-credit-card",
      onClick: () => {
        setShowChangePaymentMethods(true);
      },
    },
  ]);

  useSignal({
    signal: ESignalType.PAYMENT_METHOD_ADDED,
    callback: () => {
      getSavedPaymentMethods();
    },
  });

  const auth = useAuthContext();

  const [showChangePlan, setShowChangePlan] = useState(false);
  const [plans, setPlans] = useState<
    (PlanDetailsTable & Omit<OrderInventoryTable, "id">)[]
  >([]);
  const [topUpOptions, setTopUpOptions] = useState<
    (TopUpOptionsTable & Omit<OrderInventoryTable, "id">)[]
  >([]);

  const [showChangePaymentMethods, setShowChangePaymentMethods] =
    useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<
    SavedPaymentMethodsTable[]
  >([]);

  const [paymentHistory, setPaymentHistory] = useState<
    {
      id: number;
      public_id: string;
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
  }, [auth.user, plans]);

  const selectedPaymentMethod = useMemo(() => {
    return savedPaymentMethods.find(
      (method) => method.id === auth.user?.selectedPaymentMethod
    );
  }, [auth.user?.selectedPaymentMethod, savedPaymentMethods]);

  const REV_PUB_KEY = "pk_eH6pNsC0AwSw1Wf8aj4UlerSiY9HEN2ovV64vv0BI4RlAUNc";

  const getAvailablePlans = async () => {
    const res = await axios.get(`${Provider.constructUrlBase({host: CloudProvider.defaultHost, port: CloudProvider.defaultPort})}/plans/get-all`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return res.data;
  };

  const getTopUpOptions = async () => {
    const res = await axios.get(`${Provider.constructUrlBase({host: CloudProvider.defaultHost, port: CloudProvider.defaultPort})}/top-up/get-options`);
    return res.data;
  };

  const getPaymentHistory = async () => {
    const res = await axios.get(
      `${Provider.constructUrlBase({host: CloudProvider.defaultHost, port: CloudProvider.defaultPort})}/payment/account-history`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    console.log(res.data);
    return res.data;
  };

  const getSavedPaymentMethods = async () => {
    axios
      .get(`${Provider.constructUrlBase({host: CloudProvider.defaultHost, port: CloudProvider.defaultPort})}/payment/get-saved-payment-methods`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        // TODO: handle potential errors
        setSavedPaymentMethods(res.data);
      });
  };

  const changePaymentMethod = async (paymentMethodId: string) => {
    await axios
      .patch(
        `${Provider.constructUrlBase({host: CloudProvider.defaultHost, port: CloudProvider.defaultPort})}/payment/change-payment-method/${paymentMethodId}`,
        {
          paymentMethodId,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((res) => {
        getSavedPaymentMethods();
        if (auth.user) {
          auth.user.selectedPaymentMethod = paymentMethodId;
        }
        toast.success("Payment method changed successfully");
      })
      .catch((e) => {
        console.log("failed to change payment method", e);
        toast.error(e?.data?.error || "Error changing payment method");
      });
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    await axios
      .delete(
        `${Provider.constructUrlBase({host: CloudProvider.defaultHost, port: CloudProvider.defaultPort})}/payment/remove-payment-method/${paymentMethodId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((res) => {
        getSavedPaymentMethods();
        toast.success("Payment method deleted successfully");
      })
      .catch((e) => {
        console.log("failed to delete payment method", e);
        toast.error(e?.data?.error || "Error deleting payment method");
      });
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

    getSavedPaymentMethods();
  });

  const topUpOrder = async (topUpId: number) => {
    // TODO: conditionally use public url or localhost based on NPM environment
    return (await axios
      .post(
        `${Provider.constructUrlBase({host: CloudProvider.defaultHost, port: CloudProvider.defaultPort})}/payment/top-up/${topUpId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((res) => {
        return res.data;
      })) as Promise<{ public_id: string }>;
  };

  const topUpCheckout = (topUpId: number) => {
    console.log("Checkout", topUpId);
    topUpOrder(topUpId)
      .then((data) => {
        if (!data.public_id) return;
        // TODO: conditionally use sandbox or production based on NPM environment
        RevolutCheckout(data.public_id, "sandbox").then((instance) => {
          // work with instance
          instance.payWithPopup({
            onSuccess: () => {
              toast.success("Top up added for processing");
            },
            // TODO: deal with errors
          });
          // TODO: deal with errors
        });
      })
      .catch((e) => {
        console.log("failed to create top up order", e);
        toast.error(e?.data?.error || "Error creating top up order");
      });
  };

  const subscriptionOrder = async (planId: number) => {
    // TODO: conditionally use public url or localhost based on NPM environment
    return (await axios
      .post(
        `${Provider.constructUrlBase({host: CloudProvider.defaultHost, port: CloudProvider.defaultPort})}/payment/subscribe/${planId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((res) => {
        return res.data;
      })) as Promise<{ public_id?: string }>;
  };

  const addPaymentMethod = async () => {
    axios
      .post(
        `${Provider.constructUrlBase({host: CloudProvider.defaultHost, port: CloudProvider.defaultPort})}/payment/add-payment-method`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((res) => {
        if (!res.data.public_id) {
          toast.error("Error when adding payment method");
          return;
        }
        RevolutCheckout(res.data.public_id, "sandbox").then((instance) => {
          instance.payWithPopup({
            savePaymentMethodFor: "merchant",
            onSuccess: () => {
              toast.success("Payment added for authorization");
            },
            // TODO: deal with errors
          });
          // TODO: deal with errors
        });
      });
  };

  const onChangePlan = (planId: number) => {
    subscriptionOrder(planId).then((data) => {
      console.log(data);
      // success with no public_id -> probably a plan cancellation or card already saved
      if (!data.public_id) {
        return;
      }
      // TODO: conditionally use sandbox or production based on NPM environment
      RevolutCheckout(data.public_id, "sandbox").then((instance) => {
        instance.payWithPopup({
          savePaymentMethodFor: "merchant",
          onSuccess: () => {
            toast.success("Plan change request added for processing");
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
          <RegularCard
            bg="bg-purple"
            title="Usage"
            minHeight="20vh"
            maxHeight="20vh"
          >
            <div>
              <h5 className="text-truncate">
                Remaining: {auth.user ? auth.user?.plan.leftover_minutes : 0}
              </h5>
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
              <h2 className="text-truncate display-6">
                Plan: {userPlan?.name}
              </h2>
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
            <SectionHeading
              title="Top-up options"
              size="2"
              divider
              subtitle="Top-up in a pinch or choose to pay manually instead of a subscription"
            />

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
              <SectionHeading
                title="Payment history"
                size="2"
                divider
                subtitle="Payment history entries are deleted after they are older than N days"
              />
              {paymentHistory.some((e) => e.state === "PENDING") && (
                <small>
                  <i className="txt-yellow bi bi-info-circle-fill pe-2"></i>
                  Press on any{" "}
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
                    <th className="text-end">State</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => {
                    return (
                      <tr>
                        <td className="align-middle">{payment.description}</td>
                        <td className="align-middle">
                          €{formatMinorPrice(payment.value)}
                        </td>
                        <td className="align-middle">
                          {new Date(payment.created_date).toISOString()}
                        </td>
                        <td className="text-end">
                          {payment.state === "PENDING" && (
                            <Button
                              className="bg-yellow txt-dark-1"
                              onClick={() => {
                                RevolutCheckout(
                                  payment.public_id,
                                  "sandbox"
                                ).then((instance) => {
                                  instance.payWithPopup({
                                    savePaymentMethodFor: "merchant",
                                    onSuccess: () => {},
                                    // TODO: deal with errors
                                  });
                                  // TODO: deal with errors
                                });
                              }}
                            >
                              Pending
                            </Button>
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
        bodyClass="pt-0"
        show={showChangePlan}
        handleClose={() => setShowChangePlan(false)}
      >
        <>
          <Stack gap={3}>
            {selectedPaymentMethod ? (
              <div>
                The currently selected card ending with{" "}
                <b>{selectedPaymentMethod?.last4}</b> (
                <Button
                  onClick={() => {
                    setShowChangePlan(false);
                    setShowChangePaymentMethods(true);
                  }}
                  className="txt-dark-1 bg-yellow py-0"
                >
                  Change
                </Button>
                ) will be charged upon selecting a new plan.
              </div>
            ) : (
              <div>
                No payment methods added to account, a new one will be added
                upon selecting a new plan
              </div>
            )}
            <Row>
              {plans.map((plan) => {
                const isCurrentPlan = auth.user?.plan.plan === plan.id;
                return (
                  <Col xs={12} md={6}>
                    <RegularCard
                      minHeight="35vh"
                      maxHeight="30vh"
                      bg={isCurrentPlan ? "bg-blue" : undefined}
                      className={`${isCurrentPlan ? "" : "clickable"} ${
                        isCurrentPlan ? "txt-dark-1" : ""
                      }`}
                      onCardClick={() => {
                        if (!isCurrentPlan) onChangePlan(plan.id);
                      }}
                    >
                      <div>
                        <h2 className="text-truncate display-6">
                          Plan: {plan.name}
                        </h2>
                        <h6>
                          Cost per month:{" "}
                          {plan.price === null
                            ? "N/A"
                            : `€${formatMinorPrice(plan.price)}`}
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
          </Stack>
        </>
      </InlineCard>

      <InlineCard
        title="Payment methods"
        show={showChangePaymentMethods}
        handleClose={() => setShowChangePaymentMethods(false)}
      >
        <div>
          <Stack gap={3}>
            <div>
              Added cards will only appear here when the card authorization is
              completed. For more information, please check the order history on
              the payment page.
            </div>
            <Button onClick={() => addPaymentMethod()}>Add new card</Button>
            <Row xs={1} md={2}>
              {savedPaymentMethods.map((method) => {
                const isCurrent = selectedPaymentMethod?.id === method.id;
                return (
                  <Col>
                    <RegularCard
                      icon="bi bi-x-circle-fill"
                      iconColor="txt-red"
                      iconClass="fs-4"
                      className={isCurrent ? "txt-dark-1" : "clickable"}
                      title={
                        <h2 className="display-6">{method.cardholder_name}</h2>
                      }
                      bg={isCurrent ? "bg-blue" : undefined}
                      onIconClick={() => {
                        deletePaymentMethod(method.id);
                      }}
                      onCardClick={() => {
                        changePaymentMethod(method.id);
                      }}
                    >
                      <h6>*****{method.last4}</h6>
                      <h6>
                        {method.expiry_month}/{method.expiry_year}
                      </h6>
                    </RegularCard>
                  </Col>
                );
              })}
            </Row>
          </Stack>
        </div>
      </InlineCard>
    </div>
  );
}
