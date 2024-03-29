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

import { useToolBar } from "../components/Hooks/useToolBar";

export default function Scans() {
    useToolBar([])

    // TODO: use the scans component used in the dashboard here.. adjust the component to be able to optionally add more elements to the table
    // or to remove items from said table. we can use the deepkeyof type to select elements from the underlying object and pass
    // them as an array to the scans component which should facilitate selecting which elements to show in the table.
    return (
        <div>
            <p>Coming soon</p>
        </div>
    );
}