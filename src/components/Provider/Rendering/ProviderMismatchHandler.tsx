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

import { ProviderType } from "../Provider"

export enum ProviderMismatchAction {
    HIDE,
    /**
     * Indicate that the component is not available for the current provider.
     * Tries to mimic the size of the original component as much as possible.
     */
    INDICATE,
    /**
     * Replace the component with a passed in component.
     */
    REPLACE
}

type ProviderMismatchHandlerProps = {
    action: ProviderMismatchAction.HIDE,
    requiredProvider: ProviderType,
} | {
    action: ProviderMismatchAction.INDICATE,
    /**
     * Any extra classes that should be added to the component that replaces the normal one.
     * This can be used to adjust the sizing further.
     */
    extraReplacedComponentClasses?: string,
    requiredProvider: ProviderType,
} | {
    action: ProviderMismatchAction.REPLACE,
    requiredProvider: ProviderType,
    component: JSX.Element
}

/**
 * Takes a certain action when the provider does not match the required provider.
 */
export default function ProviderMismatchHandler(props: ProviderMismatchHandlerProps){
    // TODO: ProviderContext should be used to determine the current provider.
    /*
     TODO: take classes, styles and and other props and store them so that
     they can be used when the provider changes to something else...
     These can be used to retain some styling when the provider changes.
     */
    return (
        <>
        <h1>ProviderDependant</h1>
        </>
    )
}