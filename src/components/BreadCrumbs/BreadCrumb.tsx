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

import { Badge, Breadcrumb } from "react-bootstrap";

type BreadCrumbProps = {
    items: {
        title: string,
        url?: string,
    }[]
}
export default function BreadCrumb(props: BreadCrumbProps) {
    return (
    <Breadcrumb>
        <Breadcrumb.Item><Badge className="bg-blue">WhichLicense detection</Badge></Breadcrumb.Item>
        <Breadcrumb.Item>
            <Badge className="bg-grey">Colors.js</Badge>
        </Breadcrumb.Item>
        {Array.from({length: 20}, (_, i) => i).map((i) => (
            <Breadcrumb.Item key={i} active>
                <Badge className="bg-grey">dep {i}</Badge>
            </Breadcrumb.Item>
        ))}
    </Breadcrumb>
    )
}