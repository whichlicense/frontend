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

import { TUser } from "../../context/AuthContext";
import { AccountType, TAccountDomain, TAddSubAccountBody, TLoginReply, TMeReply, TSubAccountAndPermissions } from "../typings/Account";
import { TScanInitiationOptions } from "../typings/Scan";
import { Provider } from "./Provider";

/**
 * Represents a connection system towards a locally hosted solution.
 */
export class LocalProvider extends Provider {
    getAllScannedDependencies(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    getPersonalScans(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    getScan(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    me(): Promise<TMeReply | null> {
        return Promise.resolve({
            firstName: "Local",
            email: "",
            domain: 0,
            selectedPaymentMethod:  null,
            plan: {
                account_id: -1,
                leftover_minutes: Infinity,
                plan: -1,
                total_minutes: Infinity,
            }
        });
    }

    getAvailableAccountPermissions(): Promise<string[]> {
        return Promise.resolve([]);
    }

    getSubAccounts(): Promise<TSubAccountAndPermissions[]> {
        return Promise.resolve([]);
    }

    getAccountDomains(): Promise<TAccountDomain[]> {
        return Promise.resolve([]);
    }

    addSubAccount(d: TAddSubAccountBody): Promise<{ message?: string | undefined; }> {
        return Promise.reject("Local provider does not support sub accounts");
    }

    login(email: string, password: string): Promise<TLoginReply> {
            return Promise.resolve({token: "LOCAL"})
    }

    register(d: TUser & { password: string }): Promise<{message: string}> {
        return Promise.reject("Local provider does not support registration");
    }

    changePassword(oldPassword: string, newPassword: string): Promise<{ message?: string | undefined; }> {
        return Promise.reject("Local provider does not support changing password");
    }
    changeEmail(newEmail: string): Promise<{ message?: string | undefined; }> {
        return Promise.reject("Local provider does not support changing email");
    }

    resendEmailConfirmation(email: string): Promise<void> {
        return Promise.reject("Local provider does not support email confirmation");
    }

    confirmEmail(token: string): Promise<void> {
        return Promise.reject("Local provider does not support email confirmation");
    }

    /**
     * Always returns AccountType.ALL in the LocalProvider as it does not have an account system.
     * @returns AccountType.AL
     */
    getLoggedInAccountType(): AccountType {
        return AccountType.ALL;
    }

    initiateScan(options: TScanInitiationOptions): Promise<void> {
        // TODO: implement me when local API wrapper is ready
        throw new Error("Method not implemented.");
    }
}
