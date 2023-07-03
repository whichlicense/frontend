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

import { orNull } from "./dummy"
import { TPipelineTestResultsOut } from "./pipeline"

export type TDiscoverOut = {
    name: string,
    version: string,
    identity: number | string,

    declaredLicense: string,
    declaredLicenseComplianceStatuses: {},
    discoveredLicense: string,
    discoveredLicenseTrace: TPipelineTestResultsOut,
    discoveredLicenseComplianceStatuses: {},

    input: string,
    type: string,
    ecosystems: string[],
    source: {
        locator: null,
        source: null,
        path: string,
    },
    generated: number,
    dependencies: {
        /**
         * name: version
         */
        [name: string]: {
            version: string,
            // TODO: not sure what this is
            type: string,
            kind: "DIRECT" | "TRANSITIVE",
            scans: {
                /**
                 * Version: identity
                 */
                [version: string]: string
            }
        }
    },
}

export type TScannedDependenciesOut = {
    name: string;
    version: string;
    type: string;
    ecosystems: string[];
    declaredLicenses: {
        /**
         * License: identity array
         */
        [license: string]: string[]
    };
    discoveredLicenses: {
        /**
         * License: identity array
         **/
        [license: string]: string[]
    }
    scans: string[]
}