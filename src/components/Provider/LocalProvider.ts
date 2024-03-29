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
import { TUser } from "../../context/AuthContext";
import { AccountType, TAccountDomain, TAddSubAccountBody, TLoginReply, TMeReply, TSubAccountAndPermissions } from "../typings/Account";
import { TEmailNotificationSettings } from "../typings/EmailNotificationSettings";
import { TScanInitiationOptions } from "../typings/Scan";
import { ESignalType, Provider } from "./Provider";
import { TDiscoverOut, TScannedDependenciesOut } from "../../types/discover";
import { TPipelineTestOptions, TPipelineTestResultsOut } from "../../types/pipeline";

// TODO: remove me when real endpoints/data are available
export type orNull<T> = T | null;
// TODO: remove me when real endpoints/data are available
export type TDummyData = {
    name: string,
    version: string,
    license: orNull<string>,
    ecosystems: string[],
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


/**
 * Represents a connection system towards a locally hosted solution.
 */
export class LocalProvider extends Provider {
    // TODO: when wrapper is available, we can assume that all scans are from the local provider
    private scans: string[] = [];

    getAllScannedDependencies(): Promise<TScannedDependenciesOut[]> {
        return axios.get(`${Provider.constructUrlBase({...this.options, port: 8085})}/cache/all?latest=true`)
            .then((res) => res.data);
    }
    getPersonalScans(): Promise<TDiscoverOut[]> {
        return axios.post(`${Provider.constructUrlBase({
            ...this.options,
            port: 8085
        })}/cache/scans`, this.scans).then((res) => res.data);
    }

    // TODO: getDependencyVersions (based on a dependency, get all versions of said dependency)
    // TODO: test pipeline endpoint that takes in license text.. will return results of the pipeline
    // TODO: endpoint to accept,reject, etc -> to a package

    testPipeline(opts: TPipelineTestOptions): Promise<TPipelineTestResultsOut> {
        return axios.post(`${Provider.constructUrlBase({
            ...this.options,
            port: 8083
        })}/identify`, opts).then((res) => res.data);
    }


    getScan(id: number | string, transitives: boolean = false): Promise<TDiscoverOut> {
        // TODO: Implement with real endpoint instead of this "patch"

        return axios.post(`${Provider.constructUrlBase({
            ...this.options,
            port: 8085
        })}/cache/scans?transitive=${transitives}`, [id]).then((res) => res.data[0]);
    }

    getScans(ids: string[], transitives: boolean = false): Promise<TDiscoverOut[]> {
        // TODO: Implement with real endpoint instead of this "patch"

        return axios.post(`${Provider.constructUrlBase({
            ...this.options,
            port: 8085
        })}/cache/scans?transitive=${transitives}`, ids).then((res) => res.data);
    }

    me(): Promise<TMeReply | null> {
        return Promise.resolve({
            firstName: "Local",
            email: "",
            domain: 0,
            selectedPaymentMethod: null,
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

    getEmailNotificationSettings(): Promise<TEmailNotificationSettings> {
        return Promise.reject("Local provider does not support email notifications");
    }

    saveEmailNotificationSettings(settings: TEmailNotificationSettings): Promise<{ message?: string | undefined; }> {
        return Promise.reject("Local provider does not support email notifications");
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
        return Promise.resolve({ token: "LOCAL" })
    }

    register(d: TUser & { password: string }): Promise<{ message: string }> {
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

    // TODO: pass in optional pipeline to use.. store pipeline in indexDB.. allow users to select when calling discover
    initiateScan(options: TScanInitiationOptions): Promise<void> {
        // TODO: implement me when local API wrapper is ready
        // throw new Error("Method not implemented.");
        return axios.post(`${Provider.constructUrlBase({
            ...this.options,
            port: 8082
        })}/discover`, options).then((res) => {
            this.scans.push(res.data);
            // this.signalSocket.dispatchEvent(new MessageEvent("message", {
            //     data: JSON.stringify({
            //         type: ESignalType.SCAN_FINISHED,
            //     })
            // }));
            // this.signalSocket.dispatchEvent(new MessageEvent("message", {
            //     data: JSON.stringify({
            //         type: ESignalType.NOTIFICATION,
            //         data: {
            //             message: "Scan finished",
            //         }
            //     })
            // }));
        })
    }
}
