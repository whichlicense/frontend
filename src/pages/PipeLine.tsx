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

import { Form } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import SectionHeading from "../components/Typography/SectionHeading";

export default function PipeLine() {
  // TODO: regex constructor in a very nice UI package..

  // TODO: this regex allows for the skipping to N line (\A(?:.*\n){1}\K(.)+)

  const selectionClass = "btn w-auto py-0 bg-yellow txt-dark-1 fs-6";
  return (
    <div>
      <SectionHeading title={"Pipeline construction"} type="display" size={"4"} />
      <RegularCard title="pipeline 1" minHeight="100%" maxHeight="100%" icon="bi bi-x-circle-fill" iconClass="txt-red float-end">
        <div className="fs-5">
          When an{" "}
          <Form.Select className={selectionClass}>
            <option>Apache 2.0</option>
            <option>MIT</option>
            <option>GPL 3.0</option>
            <option>CC-BY-4.0</option>
          </Form.Select> {" "}
          License is detected with a confidence {" "}
          <Form.Select className={selectionClass}>
            <option>below</option>
            <option>above</option>
            <option>at</option>
          </Form.Select> {" "}
          <Form.Control type="number" placeholder="50" min={0} max={100} className={selectionClass} />%; {" "}
          <br />
          If the change {" "}
          <Form.Select className={selectionClass}>
            <option>is only an email</option>
            <option>is only a phone </option>
          </Form.Select> {" "}
          adjust the confidence to {" "}
          <Form.Control type="number" placeholder="50" min={0} max={100} className={selectionClass} />%; {" "}
        </div>
      </RegularCard>
    </div>
  );
}
