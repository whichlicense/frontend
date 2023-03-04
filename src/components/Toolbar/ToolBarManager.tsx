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

import { Button, ButtonGroup, Form, Stack } from "react-bootstrap";
import {
  ToolBarItem,
  ToolBarItemType,
  useToolBarContext,
} from "../../context/ToolBarContext";
import BackButton from "./BackButton";
import HelpButton from "./HelpButton";
import "../../styles/Button.css";
import { useState } from "react";
import { InlineCard } from "../Modals/InlineCard";
import ReactMarkdown from 'react-markdown'


type ToolBarManagerProps = {};
export default function ToolBarManager(props: ToolBarManagerProps) {
  const { items } = useToolBarContext();
  const [showHelp, setShowHelp] = useState(false)

  const renderToolBarItem = (item: ToolBarItem) => {
    switch (item.type) {
      case ToolBarItemType.BUTTON:
        return (
          <Button
            onClick={item.onClick}
            className={`text-truncate ${item.className || ""}${
              item.bgColor || "bg-dark-1"
            } ${item.txtColor || "txt-white"} tool-bar-button`}
          >
            <Stack direction="horizontal" gap={2}>
              {item.icon && <i className={item.icon}></i>}
              {item.title || ""}
            </Stack>
          </Button>
        );
      case ToolBarItemType.TEXT:
        return (
          <h6
            className={`text-truncate text-align-baseline py-0 my-0 fs-4 ${
              item.txtColor || "txt-white"
            }`}
          >
            {item.title}
          </h6>
        );
      case ToolBarItemType.INPUT:
        return (
          <>
            <input
              className="btn bg-white txt-dark-1"
              placeholder={item.placeholder || "..."}
              defaultValue={item.defaultValue || ""}
              onChange={(e) => item.onChange(e.target.value)}
            />
          </>
        );
      case ToolBarItemType.SEPARATOR:
        return (
          <div
            className={`vr ${item.color || "bg-grey"} rounded opacity-100`}
            style={{ padding: "2px" }}
          />
        );
      default: {
        return <>ERROR</>;
      }
    }
  };

  const onHelpButtonClick = () => {
    setShowHelp(true)
  }

  return (
    <div>
      <div className="position-relative">
        <div
          className="position-absolute w-100 d-flex justify-content-between"
          style={{ zIndex: 1 }}
        >
          <Stack
            direction="horizontal"
            className="w-100 d-flex justify-content-start no-scrollbar"
            style={{
              overflowX: "auto",
            }}
          >
            <ButtonGroup className="tool-bar-button-group">
              <BackButton />
              {items.length > 0 &&
                renderToolBarItem({
                  type: ToolBarItemType.SEPARATOR,
                  color: "bg-dark-1",
                })}

              {items.map((item) => {
                return renderToolBarItem(item);
              })}
            </ButtonGroup>
          </Stack>

          <HelpButton onClick={onHelpButtonClick} />
        </div>
      </div>
      <InlineCard show={showHelp} handleClose={() => setShowHelp(false)}>
        <ReactMarkdown>
          # COMING SOON!
        </ReactMarkdown>
      </InlineCard>
    </div>
  );
}
