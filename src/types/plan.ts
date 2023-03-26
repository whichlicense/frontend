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

export enum EAccountPlan {
    Basic,
    Unlimited,
    Dev
}

export interface PlanDetailsTable {
    /**
     * Unique.. identifies the type of plan.
     */
    id: EAccountPlan;
    name: string;
    description: string;
    price_per_month: number | null;
    /**
     * Indicates if this plan is available for purchase or not.
     * Can be set to false to keep certain users on the legacy plan.
     */
    available: boolean;
}