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


export type TPipelineStep = {
    operation: "replace",
    parameters: {
            text?: string,
            pattern?: string,
            replacement: string
    }
} | {
    operation: "batch",
    parameters: TPipelineStep[]
} | {
    operation: "remove",
    parameters: {
        text?: string,
        pattern?: string,
    }
}
export type TPipelineTestOptions = {
    algorithm: string,
    license: string,
    pipeline?: {
        threshold: number,
        name: string,
        steps: TPipelineStep[],
    }
}

export type TPipelineTrace = {
    step: number,
    operation: string,
    algorithm: string,
    parameters: Record<string, unknown>,
    matches: Record<string, number>,
    terminated: boolean
}
export type TPipelineTestResultsOut = {
    name: string,
    license: string | null,
    confidence: number,
    algorithm: string,
    parameters: {
        exit_on_exact_match: boolean
    },
    traces: TPipelineTrace[]
    input: string
}