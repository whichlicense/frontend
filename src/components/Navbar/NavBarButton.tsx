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

import { Button, Stack } from "react-bootstrap";
type NavBarButtonProps = {
  text: string;
  iconClass: string;
  onClick?: () => void;
  collapsed?: boolean;
  selected?: boolean;
};
export default function NavBarButton(props: NavBarButtonProps) {
  return (
    <Button
      onClick={() => props.onClick && props.onClick()}
      className={"text-start py-2 ps-3" + (props.selected ? " selected" : "")}
    >
      <Stack direction="horizontal">
        <i className={props.iconClass}></i>
        <div
          className={`ps-3 text-truncate ${
            props.collapsed
              ? "nav-button-text-collapsed"
              : "nav-button-text-expanded"
          }`}
        >
          {props.text}
        </div>
      </Stack>
    </Button>
  );
}
