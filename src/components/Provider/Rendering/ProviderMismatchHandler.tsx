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

import { useMemo } from "react";
import { useProviderContext } from "../../../context/ProviderContext";
import { CloudProvider } from "../CloudProvider";
import { ProviderType } from "../Provider";

export enum ProviderMismatchAction {
  HIDE,
  /**
   * Replace the component with a passed in component.
   */
  REPLACE,
}

type ProviderMismatchHandlerDefaults = {
  children: JSX.Element;
  requiredProvider: ProviderType;
};
type ProviderMismatchHandlerProps = (
  | {
      action: ProviderMismatchAction.HIDE;
    }
  | {
      action: ProviderMismatchAction.REPLACE;
      replacingComponent: JSX.Element;
    }
) &
  ProviderMismatchHandlerDefaults;

/**
 * Takes a certain action when the provider does not match the required provider.
 */
export default function ProviderMismatchHandler(
  props: ProviderMismatchHandlerProps
) {
  const { provider } = useProviderContext();
  const providerType = useMemo(() => {
    return provider instanceof CloudProvider
      ? ProviderType.CLOUD
      : ProviderType.LOCAL;
  }, [provider]);

  const takeAction = () => {
    switch (props.action) {
      case ProviderMismatchAction.HIDE:
        return null;
      case ProviderMismatchAction.REPLACE:
        return props.replacingComponent;
    }
  };

  return (
    <>
      {props.requiredProvider === providerType ? props.children : takeAction()}
    </>
  );
}
