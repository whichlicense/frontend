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
import { Link, useNavigate } from "react-router-dom";

export default function NavigationBar() {
    const navigate = useNavigate();
  return (
    <div className="d-flex">
      <section className="align-self-center rounded container clamp w-100 d-flex flex-column">
        <br />
            <h3 style={{fontSize: '1.8vw'}}>WhichLicense</h3>
        <br />

  
        <Stack gap={2} className="flex-grow-0 mb-auto">
          <Button onClick={()=>navigate('/dashboard')} className="selected text-start py-2 ps-3">
            <i className="bi bi-building-check"></i> Dashboard
          </Button>
          <Button className="text-start py-2 ps-3 text-truncate">
            <i className="bi bi-card-checklist"></i> Scans
          </Button>
          <Button className="text-start py-2 ps-3 text-truncate">
            <i className="bi bi-binoculars"></i> Search
          </Button>
          <Button className="text-start py-2 ps-3 text-truncate">
            <i className="bi bi-person-rolodex"></i> Accounts
          </Button>
          <Button className="text-start py-2 ps-3 text-truncate">
            <i className="bi bi-bell"></i> Notifications
          </Button>
          <Button className="text-start py-2 ps-3 text-truncate">
            <i className="bi bi-gear-wide-connected"></i> Settings
          </Button>
        </Stack>

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
        <Button className="rounded bg-dark-1 text-start py-2 ps-3 text-truncate">
          <i className="bi bi-credit-card"></i> Payment
        </Button>

        <hr className="text-muted mx-1" />

        <Button className="text-start py-2 ps-3 text-truncate">
          <i className="bi bi-arrow-left-circle"></i> Logout
        </Button>
        <br />
      </section>
    </div>
  );
}
