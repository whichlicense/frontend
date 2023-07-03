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

import axios from "axios";

export type TGitHubLicenseInfo = {
    key: string,
    name: string
    spdx_id: string,
    url: string,
    node_id: string,
    html_url: string,
    description: string,
    implementation: string,
    permissions: string[],
    conditions: string[],
    limitations: string[],
    body: string,
    featured: boolean
}

export function getInfo(ofl: string): Promise<TGitHubLicenseInfo>{
    return axios.get(`https://api.github.com/licenses/${ofl}`).then((res) => res.data).catch((err) => console.error(err));
}