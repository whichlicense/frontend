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

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {open, setOpen} = useDrawerContext()

    // TODO: experiment: when we hover over the drawer it opens? and when we leave it closes?.. i like closed better

  return (
    <div className={`${open ? "nav-open" : "nav-closed"}`}>
      <div className="position-relative">
      <Button
            onClick={() => setOpen(x=>!x)}
            className={`bg-yellow text-dark position-absolute ${open ? 'nav-collapse-button' : 'nav-expand-button'}`}
          >
            <i className={`bi bi-caret-${open ? 'left' : 'right'}-fill`}></i>
          </Button>
      </div>

      <section className="align-self-center rounded container clamp w-100 d-flex flex-column">
        <br />
        {open && <h3 style={{ fontSize: "100%" }}>WhichLicense</h3>}
        <br />

        <Stack gap={2} className="flex-grow-0 mb-auto">
          <NavBarButton
            onClick={() => navigate("/dashboard")}
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
            onClick={() => navigate("/accounts")}
            text={"Accounts"}
            iconClass={"bi bi-person-rolodex"}
            collapsed={!open}
            selected={location.pathname === "/accounts"}
          />

          <NavBarButton
            onClick={() => navigate("/notifications")}
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

        {open && (
          <Card className="w-100 bg-dark-1 rounded p-3 mb-2">
            <small className="text-truncate">Remaining: 93 min</small>
            <hr />
            <ProgressBar>
              <ProgressBar
                className="bg-yellow"
                striped
                variant="warning"
                now={10}
                key={1}
              />
              <ProgressBar
                className="bg-blue"
                striped
                variant="info"
                now={90}
                key={2}
              />
            </ProgressBar>
            <div className="d-flex justify-content-between">
              <small>7</small>
              <small>100</small>
            </div>
          </Card>
        )}

        <NavBarButton
          onClick={() => navigate("/payment")}
          text={"Payment"}
          collapsed={!open}
          iconClass={"bi bi-credit-card"}
        />

        <hr className="text-muted mx-1" />

        <NavBarButton
          text={"Logout"}
          collapsed={!open}
          iconClass={"bi bi-arrow-left-circle"}
        />
        <br />
      </section>
    </div>
  );
}
