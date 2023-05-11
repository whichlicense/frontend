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

import { useAuthContext } from "../../context/AuthContext";
import { EAccountDomain } from "../typings/Account";

export type TRequireDomainsProps = {
    domains: EAccountDomain[]
    replacingComponent?: JSX.Element
    children: JSX.Element
}

/**
 * Forces the user to be in a certain domain before rendering the children.
 * ---
 * * If the user is in the ```ALL``` domain, the children will always be rendered.
 * * If the user is not in the required domain, the ```replacingComponent``` will be rendered instead. 
 * * If the ```replacingComponent``` is not provided, nothing will be rendered (i.e., ```null```).
 */
export default function RequireDomains(props: TRequireDomainsProps){
    const auth = useAuthContext();
    const replacingComponent = props.replacingComponent || null;
    const currentDomain = auth.getDomain();
    if(currentDomain === EAccountDomain.ALL) return props.children;

    return (
        <>{props.domains.includes(currentDomain) ? props.children : replacingComponent}</>
    )
}