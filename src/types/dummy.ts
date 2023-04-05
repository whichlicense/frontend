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

export type orNull<T> = T | null;
export type TDummyData = {
    name: string,
    version: string,
    license: orNull<string>,
    ecosystem: string,
    source: string,
    generated: number,
    directDependencies: {
        name: string,
        version: string,
        license: orNull<string>,
        scope: string,
        ecosystem: string,
        directDependencies: {
            [dependencyName: string]: string,
        }
    }[],
    transitiveDependencies: {
        name: string,
        version: string,
        license: orNull<string>,
        scope: string,
        ecosystem: string,
        directDependencies: {
            [dependencyName: string]: string,
        }
    }[]
}