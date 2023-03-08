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

import { useRef } from "react";
import { Card } from "react-bootstrap";
import { hasScrollBar } from "../utils/scroll";
import ScrollIndicator from "../utils/ScrollIndicator";
import "../../styles/Card.css";
import { TxtColors } from "../typings/Colors";

type RegularCardProps = {
  title?: string | JSX.Element;
  bg?:
    | "bg-dark"
    | "bg-dark-1"
    | "bg-blue"
    | "bg-yellow"
    | "bg-grey"
    | "bg-purple";
  maxHeight?: string;
  minHeight?: string;
  maxWidth?: string;
  minWidth?: string;
  overflowX?: "auto" | "hidden" | "scroll" | "visible";
  className?: string;
  fadeIn?: boolean;

  icon?: string;
  iconColor?: TxtColors;

  onCardClick?: () => void;
  onIconClick?: () => void;

  children: JSX.Element | JSX.Element[] | string;

  id?: string;
};

/**
 * The preferred way to create this card would be to put it in a Col component.
 */
export default function RegularCard(props: RegularCardProps) {
  const bodyRef = useRef(null);
  return (
    <Card
      className={`regular-card shadow-sm rounded align-self-stretch ${
        props.bg ? props.bg : "bg-dark-1"
      } text-bg-dark w-100 ${props.fadeIn ? "fade-in-forward" : ""} ${
        props.className || ""
      }`}
      style={{
        maxWidth: props.maxWidth || "unset",
        minWidth: props.minWidth || "unset",
      }}
      onClick={() => {
        props.onCardClick && props.onCardClick();
      }}
      id={props.id}
    >
      <div className="p-4">
        <div className="d-flex justify-content-between">
          {props.title && props.title.constructor.name === "String" ? (
            <span className="opacity-75">{props.title}</span>
          ) : (
            props.title
          )}
          {props.icon && (
            <div>
              <i
                onClick={() => {
                  props.onIconClick && props.onIconClick();
                }}
                className={`${props.icon} ${props.iconColor || ""}`}
              ></i>
            </div>
          )}
        </div>

        <Card.Body
          className="px-0"
          style={{
            maxHeight: props.maxHeight || "15vh",
            minHeight: props.minHeight || "unset",
            overflowY: props.overflowX || "auto",
          }}
          ref={bodyRef}
        >
          {props.children}
        </Card.Body>
        {/* Only show chevron when Card.Body is long enough to be scrollable */}
        <ScrollIndicator bodyRef={bodyRef} />
      </div>
    </Card>
  );
}
