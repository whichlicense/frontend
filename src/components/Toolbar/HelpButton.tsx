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

import { Button } from "react-bootstrap";

type HelpButtonProps = {
  onClick?: () => void;
};
export default function HelpButton(props: HelpButtonProps) {
  // TODO: lower opacity a bit when scroll starts
  return (
    <Button onClick={()=> props.onClick && props.onClick()} className={`bg-green text-dark page-help-button shadow-sm`}>
      <i className="bi bi-question-lg txt-dark-1"></i>
    </Button>
  );
}
