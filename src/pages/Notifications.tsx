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

import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { AuthState, useForceAuth } from "../components/Hooks/useForceAuth";

export default function Notifications() {
  useForceAuth({
    ifState: AuthState.LOGGED_OUT,
    travelTo: "/login",
  })
  // TODO: what to receive emails for? everything? have a list that they can toggle stuff on and off?
  // TODO: webhooks for what? everything? have a list that they can toggle stuff on and off?
  return (
    <div>
      <Stack gap={2}>
        <RegularCard title="Basic notifications">
          <small className="text-muted">
            Press the buttons after each input to enable or disable their
            functionality.
          </small>
          <div>
            <br />
            <InputGroup className="mb-3">
              <Form.Control placeholder="Email to" />
              <Button className="bg-green txt-dark-1">Enabled</Button>
            </InputGroup>
          </div>
        </RegularCard>
        <RegularCard title="Advanced notifications">
          <InputGroup className="mb-3">
            <Form.Control placeholder="WebHook call url" />
            <Button className="bg-grey txt-white">Help</Button>
            <Button className="bg-red txt-dark-1">Disabled</Button>
          </InputGroup>
        </RegularCard>
      </Stack>
    </div>
  );
}
