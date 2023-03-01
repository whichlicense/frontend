/*
 *   Copyright (c) 2022 Duart Snel
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

import { useRef, useState, useEffect } from 'react'

/**
 * Credits to Niall Crosby (https://dev.to/ag-grid/react-18-avoiding-use-effect-getting-called-twice-4i9e).
 * React18 introduced a breaking change which causes useEffect to call twice even with no dependencies. this aims to fix that
 */
export const useEffectOnce = (effect: () => void | (() => void)) => {
    const destroyFunc = useRef<void | (() => void)>()
    const effectCalled = useRef(false)
    const renderAfterCalled = useRef(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [val, setVal] = useState<number>(0)

    if (effectCalled.current) {
        renderAfterCalled.current = true
    }

    useEffect(() => {
        // only execute the effect first time around
        if (!effectCalled.current) {
            destroyFunc.current = effect()
            effectCalled.current = true
        }

        // this forces one render after the effect is run
        setVal((val) => val + 1)

        return () => {
            // if the comp didn't render since the useEffect was called,
            // we know it's the dummy React cycle
            if (!renderAfterCalled.current) {
                return
            }
            if (destroyFunc.current) {
                destroyFunc.current()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}
