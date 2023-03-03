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

import { createContext, useState, useContext } from "react";
import { BgColors, TxtColors } from "../components/typings/Colors";

export enum ToolBarItemType {
  BUTTON,
  TEXT,
  SEPARATOR
}
export type ToolBarItem =
  | {
      type: ToolBarItemType.BUTTON;
      title?: string;
      bgColor?: BgColors;
      txtColor?: TxtColors;
      icon?: string;
      className?: string;
      onClick: () => void;
    }
  | {
      type: ToolBarItemType.TEXT;
      txtColor?: TxtColors;
      title: string;
    }
    | {
      type: ToolBarItemType.SEPARATOR;
      color?: BgColors;
    };

export const ToolBarContext = createContext<{
    items: ToolBarItem[];
    setItems: React.Dispatch<React.SetStateAction<ToolBarItem[]>>;
}>({} as any);

export const ToolBarContextProvider = (props: any) => {
  const [items, setItems] = useState<ToolBarItem[]>([]);

  return (
    <ToolBarContext.Provider value={{ items, setItems }}>
      {props.children}
    </ToolBarContext.Provider>
  );
};

export const useToolBarContext = () => useContext(ToolBarContext);
