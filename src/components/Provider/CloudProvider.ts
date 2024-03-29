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
import { toast } from "react-toastify";
import { AccountType, TAccountDomain, TAddSubAccountBody, TLoginReply, TMeReply, TSubAccountAndPermissions } from "../typings/Account";
import { TScanInitiationOptions } from "../typings/Scan";
import { Provider } from "./Provider";
import { TUser } from "../../context/AuthContext";
import { toastError } from "../utils/toasting";
import { TEmailNotificationSettings } from "../typings/EmailNotificationSettings";
import { TPipelineTestOptions, TPipelineTestResultsOut } from "../../types/pipeline";
import { TDiscoverOut } from "../../types/discover";

/**
 * Represents a connection system towards the cloud hosted solution.
 */
export class CloudProvider extends Provider {
    static defaultHost = "192.168.1.130";
    static defaultPort = 8081;

    testPipeline(opts: TPipelineTestOptions): Promise<TPipelineTestResultsOut> {
        throw new Error("Method not implemented.");
    }

    getScan(id: number): Promise<any> {
        return axios.get(`${Provider.constructUrlBase(this.options)}/scan/get-scan/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            toastError(err, "Something went wrong when fetching the scan. Please try again later.");
            return {};
        })
    }

    getScans(id: string[], transitives?: boolean | undefined): Promise<TDiscoverOut[]> {
        return Promise.reject("Method not implemented.");
    }

    me(): Promise<TMeReply | null> {
        return axios
            .get(`${Provider.constructUrlBase(this.options)}/me`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                return res.data;
            })
            .catch((e) => {
                return null;
            });
    }

    getAvailableAccountPermissions(): Promise<string[]> {
        return axios.get(
            `${Provider.constructUrlBase(this.options)}/settings/get-available-permissions`
        ).then((res) => res.data)
    }

    getEmailNotificationSettings(): Promise<TEmailNotificationSettings> {
        return axios.get(
            `${Provider.constructUrlBase(this.options)}/notification/get-email-trigger-conditions`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }
        ).then((res) => res.data)
    }

    saveEmailNotificationSettings(settings: TEmailNotificationSettings): Promise<{ message?: string | undefined; }> {
        return axios.post(
            `${Provider.constructUrlBase(this.options)}/notification/save-email-notification-settings`,
            settings,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }
        ).then((res) => res.data)
    }

    getSubAccounts(): Promise<TSubAccountAndPermissions[]> {
        return axios.get(`${Provider.constructUrlBase(this.options)}/sub-account/get-all`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then((res) => res.data)
    }

    addSubAccount(d: TAddSubAccountBody): Promise<{ message?: string | undefined; }> {
        return axios
            .post(
                `${Provider.constructUrlBase(this.options)}/sub-account/add`,
                d,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            ).then((res) => res.data)
    }

    getAccountDomains(): Promise<TAccountDomain[]> {
        return axios.get(`${Provider.constructUrlBase(this.options)}/domain/get-domains`).then((res) => res.data);
    }

    login(email: string, password: string): Promise<TLoginReply> {
        return axios
            .post(`${Provider.constructUrlBase(this.options)}/login`, { email, password })
            .then((res) => {
                if (!res.data.token) return Promise.reject("No token received");
                return res.data;
            });
    }

    register(d: TUser & { password: string }): Promise<{ message: string }> {
        return axios.post(`${Provider.constructUrlBase(this.options)}/register`, d);
    }

    confirmEmail(token: string): Promise<void> {
        return axios.post(
            `${Provider.constructUrlBase(this.options)}/auth/confirm-email`,
            { token },
            {}
        );
    }

    resendEmailConfirmation(email: string): Promise<void> {
        return axios.post(
            `${Provider.constructUrlBase(this.options)}/auth/resend-email-confirmation`,
            { email },
            {}
        );
    }

    changePassword(oldPassword: string, newPassword: string): Promise<{ message?: string | undefined; }> {
        return axios.post(
            `${Provider.constructUrlBase(this.options)}/auth/change-password`,
            { current: oldPassword, new: newPassword },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }
        );
    }

    changeEmail(newEmail: string): Promise<{ message?: string | undefined; }> {
        return axios.post(
            `${Provider.constructUrlBase(this.options)}/auth/change-email`,
            { newEmail },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }
        );
    }

    getAllScannedDependencies(): Promise<any[]> {
        return axios.get(`${Provider.constructUrlBase(this.options)}/scan/get-scans`, {}).then((res) => {
            return res.data;
        }).catch((err) => {
            toastError(err, "Failed to fetch scanned dependencies. Please try again later.");
            return [];
        })
    }

    getPersonalScans(): Promise<any[]> {
        return axios
            .get(`${Provider.constructUrlBase(this.options)}/scan/personal-scans`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                return res.data;
            }).catch((e) => {
                toastError(e, "Failed to get your personal scans");
                return [];
            });
    }

    getLoggedInAccountType(): AccountType {
        // TODO: implement me by checking the account type of the logged in user (the auth system is to be moved here first)
        return AccountType.ALL;
    }

    initiateScan(params: TScanInitiationOptions): Promise<void> {
        return axios.post(`${Provider.constructUrlBase(this.options)}/scan/initiate`, params, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then((_) => {
                toast.success("Scan initiated. You will be notified when it is complete.");
            })
            .catch((e) => {
                toastError(e, "Failed to initiate scan");
            });
    }
}