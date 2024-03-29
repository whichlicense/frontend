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

import { useState } from "react";
import { useEffectOnce } from "../utils/useEffectOnce";

export type TElementSize = {
  width: number | undefined;
  height: number | undefined;
};
type TUseElementSizeProps = {
  id: string;
  debounce?: number;
}
export function useElementSize(props: TUseElementSizeProps): TElementSize {
  const [elementSize, setElementSize] = useState<TElementSize>({
    width: undefined,
    height: undefined,
  });
  useEffectOnce(() => {
    const element = document.getElementById(props.id);
    if (!element) return;

    let timeout: number | undefined;

    function handleResize() {
      const registerTimeout = () => {
        timeout = window.setTimeout(() => {
          setElementSize({
            width: element?.clientWidth,
            height: element?.clientHeight,
          });
        }, props.debounce)
      };

      if(props.debounce){
        if(timeout){
          window.clearTimeout(timeout);
          timeout = undefined;
        }
        registerTimeout();
      }else{
        setElementSize({
          width: element?.clientWidth,
          height: element?.clientHeight,
        });
      }
    }
    const ro = new ResizeObserver(handleResize);
    ro.observe(element);
    handleResize();

    return () => ro.disconnect();
  });
  return elementSize;
}
