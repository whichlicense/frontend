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

import { TUser, TUserPlan } from "../../context/AuthContext";

/**
 * Represents the type of account that is connected to the server.
 * This directly ties in to the concerns a given account has:
 *  for example, a legal account only needs to see license related stuff
 */
export enum AccountType {
    /**
     * Special account type for viewing everything.
     * > I.e., this account is concerned with everything.
     */
    ALL,
    LEGAL,
    /**
     * Special account type for customer access when one wants to give the customer direct
     * access to the dashboard instead of exporting results.
     * > Ideally this customer only sees finished top-level scans with no ability to take actions
     */
    CUSTOMER,

}

export type TMeReply = | (TUser & { plan: TUserPlan } & {
    domain: number;
    selectedPaymentMethod?: string | null;
  });

export type TLoginReply = {
    token: string;
}