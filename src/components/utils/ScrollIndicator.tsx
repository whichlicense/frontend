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

import { useEffect, useState } from "react";
import { hasScrollBar } from "./scroll";

type ScrollIndicatorProps = {
    bodyRef: React.RefObject<any>;
}
export default function ScrollIndicator(props: ScrollIndicatorProps){
    const [show, setShow] = useState(hasScrollBar(props.bodyRef));
    window.addEventListener("resize", () => {
        setShow(hasScrollBar(props.bodyRef));
    });
    useEffect(() => {
        setShow(hasScrollBar(props.bodyRef));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div>
        {show && (
          <div style={{ position: "absolute", bottom: "0", left: "50%" }}>
            <i className="text-muted bi bi-chevron-compact-down"></i>
          </div>
        )}
        </div>
    )
}