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

import { Button, Card, ProgressBar, Stack } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarButton from "./NavBarButton";
import "./Navbar.css";
import { useDrawerContext } from "../../context/DrawerContext";
import { useAuthContext } from "../../context/AuthContext";
import { useMemo } from "react";
import PlanUsageBar from "../ProgressBars/PlanUsageBar";
import { useProviderContext } from "../../context/ProviderContext";
import { ProviderType } from "../Provider/Provider";
import { toast } from "react-toastify";

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthContext();
  const provider = useProviderContext();
  const { open, setOpen } = useDrawerContext();

  // TODO: experiment: when we hover over the drawer it opens? and when we leave it closes?.. i like closed better

  return (
    <div
      id="nav-content-section"
      className={`${open ? "nav-open" : "nav-closed"}`}
    >
      <div className="position-relative">
        <Button
          onClick={() => setOpen((x) => !x)}
          className={`bg-purple text-dark position-absolute shadow-sm ${
            open ? "nav-collapse-button" : "nav-expand-button"
          }`}
          style={{ zIndex: 1000 }}
        >
          <i className={`bi bi-caret-${open ? "left" : "right"}-fill`}></i>
        </Button>
      </div>

      <section className="align-self-center rounded container clamp w-100 d-flex flex-column shadow-fade-in">
        <Stack gap={2} className="flex-grow-0 mb-auto">
          <div className="pt-2 pb-3">
            {open ? <h3 style={{ fontSize: "100%" }}>WhichLicense</h3> : <br />}
          </div>
          <NavBarButton
            disabled={!auth.isLoggedIn()}
            onClick={() =>
              auth.isLoggedIn() ? navigate("/dashboard") : navigate("/login")
            }
            text={"Dashboard"}
            iconClass={"bi bi-building-check"}
            collapsed={!open}
            selected={location.pathname === "/dashboard"}
          />

          <NavBarButton
            onClick={() => navigate("/scans")}
            text={"Scans"}
            iconClass={"bi bi-card-checklist"}
            collapsed={!open}
            selected={location.pathname === "/scans"}
          />

          <NavBarButton
            onClick={() => navigate("/search")}
            text={"Search"}
            iconClass={"bi bi-binoculars"}
            collapsed={!open}
            selected={location.pathname === "/search"}
          />

          <NavBarButton
            onClick={() => {
              if (
                !auth.isLoggedIn() &&
                provider.getProviderType() !== ProviderType.LOCAL
              ) {
                navigate("/login");
              } else if (
                auth.isLoggedIn() &&
                provider.getProviderType() !== ProviderType.LOCAL
              ) {
                navigate("/sub-accounts");
              } else {
                toast.warn(
                  "This feature is not available when using a locally connected CLI."
                );
              }
            }}
            disabled={
              !auth.isLoggedIn() ||
              provider.getProviderType() === ProviderType.LOCAL
            }
            text={"Accounts"}
            iconClass={"bi bi-person-rolodex"}
            collapsed={!open}
            selected={location.pathname === "/sub-accounts"}
          />

          <NavBarButton
            disabled={!auth.isLoggedIn()}
            onClick={() =>
              auth.isLoggedIn()
                ? navigate("/notifications")
                : navigate("/login")
            }
            text={"Notifications"}
            iconClass={"bi bi-bell"}
            collapsed={!open}
            selected={location.pathname === "/notifications"}
          />

          <NavBarButton
            onClick={() => navigate("/settings")}
            text={"Settings"}
            collapsed={!open}
            iconClass={"bi bi-gear-wide-connected"}
            selected={location.pathname === "/settings"}
          />
        </Stack>

        {provider.getProviderType() === ProviderType.LOCAL ? (
          <>
            <NavBarButton
              onClick={() => {
                toast.warn(
                  <>
                    <h6 className="mb-0">Using a locally connected CLI</h6>
                    <small className="text-muted">
                      Most features will be disabled in this mode.
                    </small>
                  </>
                );
              }}
              text={"Local provider"}
              collapsed={!open}
              iconClass={"bi bi-exclamation-triangle"}
              className="bg-yellow txt-dark-1 mb-3"
            />
          </>
        ) : (
          <>
            {open && auth.isLoggedInMemo && (
              <Card className="w-100 bg-dark-1 rounded p-3 mb-2">
                <small className="text-truncate">
                  Remaining: {auth.user ? auth.user?.plan.leftover_minutes : 0}
                </small>
                <hr />
                <PlanUsageBar
                  total_minutes={auth.user?.plan.total_minutes || 0}
                  leftover_minutes={auth.user?.plan.leftover_minutes || 0}
                />
                <div className="d-flex justify-content-between">
                  <small>{auth.user?.plan.leftover_minutes || 0}</small>
                  <small>{auth.user ? auth.user?.plan.total_minutes : 0}</small>
                </div>
              </Card>
            )}
          </>
        )}

        {provider.getProviderType() === ProviderType.CLOUD && (
          <>
            <NavBarButton
              disabled={!auth.isLoggedIn()}
              onClick={() =>
                auth.isLoggedIn() ? navigate("/payment") : navigate("/login")
              }
              text={"Payment"}
              collapsed={!open}
              iconClass={"bi bi-credit-card"}
            />

            <hr className="text-muted mx-1" />

            {auth.isLoggedInMemo ? (
              <NavBarButton
                text={"Logout"}
                collapsed={!open}
                onClick={() => auth.logout()}
                iconClass={"bi bi-arrow-left-circle"}
              />
            ) : (
              <NavBarButton
                text={"Login"}
                collapsed={!open}
                onClick={() => navigate("/login")}
                iconClass={"bi bi-person-circle"}
              />
            )}
            <br />
          </>
        )}
      </section>
    </div>
  );
}
