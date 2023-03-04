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

export type ProviderOptions = {
    host: string;
    port: number;
}

export enum ProviderType {
    LOCAL,
    CLOUD
}

/**
 * Represents a connection system towards a server.
 */
export abstract class Provider {
    protected options: ProviderOptions;
    constructor(options: ProviderOptions) {
        this.options = options;
    }

    // TODO: all possible APIs that are ours go here (e.g., getScan, scanProject, getProjects, etc.)
    static checkForLocalServer() {
        // TODO: check if there is a local server running and check version
        // TODO: toast with error if version mismatch
        return false;
    }
}