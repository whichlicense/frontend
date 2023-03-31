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

import { Button, Form } from "react-bootstrap";
import SectionHeading from "../Typography/SectionHeading";
import { InlineCard } from "./InlineCard";

type TAddProjectCardProps = {
    show: boolean;
    handleClose?: () => void
}
export default function AddProjectCard(props: TAddProjectCardProps){
    return (
        <InlineCard show={props.show} handleClose={props.handleClose}>
        <>
          <SectionHeading title="Add project" size="6" type="display" />
          <Form className="pt-2">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>URL</Form.Label>
              <Form.Control type="text" placeholder="Enter project url (e.g., github url)" />
              <Form.Text className="text-muted">
                <small className="text-muted">
                  <i className="txt-yellow pe-2 bi bi-exclamation-triangle-fill"></i>
                  Errors will come here. lorem ipsum dolor sit amet, consectetur
                </small>
              </Form.Text>
            </Form.Group>

            <Button type="submit">
              Submit
            </Button>
          </Form>
        </>
      </InlineCard>
    )
}