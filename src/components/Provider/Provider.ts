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
import { TTelemetryEntryCustomEvent, Telemetry } from "../utils/Telemetry";
import { TScanInitiationOptions } from "../typings/Scan";
import { AccountType, TLoginReply, TMeReply } from "../typings/Account";
import { TUser } from "../../context/AuthContext";

export type ProviderOptions = {
    host: string;
    port?: number;
    secure?: boolean;
}

export enum ProviderType {
    LOCAL,
    CLOUD
}

export enum ESignalType {
    PAYMENT_METHOD_ADDED,
    PLAN_CHANGED,
    MINUTED_CHANGED,
    SCAN_FINISHED,
    NOTIFICATION
}

export type TSignalCallBack = (type: ESignalType, data: any) => void;

/**
 * Represents a connection system towards a server.
 */
export abstract class Provider {
    protected options: ProviderOptions;
    protected signalSocket: WebSocket;
    private onSignal: Set<TSignalCallBack>;
    constructor(options: ProviderOptions) {
        this.options = options;

        const savedToken = localStorage.getItem("token");

        this.signalSocket = new WebSocket(`${options.secure ? 'wss' : 'ws'}://${options.host}:${options.port}/socket/signals`);

        this.signalSocket.addEventListener("open", () => {
            console.log("Signal socket opened");
            this.signalSocket.send(savedToken || "NA");
        })

        this.signalSocket.addEventListener("message", async (event) => {
            const d = JSON.parse(event.data) as { type: ESignalType, data: any };
            if (d.type === ESignalType.NOTIFICATION && d.data?.message) {
                toast.info(d.data.message)

                if (!document.hasFocus()) {
                    let permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        const notification = new Notification("WhichLicense", {
                            body: d.data.message,
                            icon: "/logo192.png",
                            image: "/logo192.png",
                            vibrate: [200, 100, 200, 100, 200, 100, 200],
                        });
                        notification.onclick = () => {
                            window.focus();
                            notification.close();
                        }
                    }
                }
            }
            for (const cb of this.onSignal) {
                cb(d.type, d.data);
            }
        })

        this.onSignal = new Set();

        window.addEventListener(Telemetry.newEntryEventName, (e: CustomEventInit<TTelemetryEntryCustomEvent>) => {
            if (e.detail) {
                this.onTelemetry(e.detail);
            }
        })
    }

    /**
     * Is called when a new telemetry entry is created.
     * @param e The data of the new telemetry entry
     */
    onTelemetry(data: TTelemetryEntryCustomEvent) {
        axios.post(
            `${this.options.secure ? 'https' : 'http'}://${this.options.host}:${this.options.port}/telemetry`,
            data
        );
    }

    // TODO: define type when available
    abstract getScan(id: string): Promise<any>;
    // TODO: define type when available
    abstract getPersonalScans(): Promise<any[]>;
    abstract initiateScan(options: TScanInitiationOptions): Promise<void>;
    // TODO: define type when available
    /**
     * Get all dependencies that have been scanned by the underlying provider, ever.
     */
    abstract getAllScannedDependencies(): Promise<any[]>;

    /**
     * Get the type of the logged in account.
     * Can be used to filter out content that is not relevant to the account type.
     */
    getLoggedInAccountType(): AccountType {
        // TODO: implement me.
        return AccountType.ALL;
    }

    abstract me(): Promise<TMeReply | null>;
    abstract login(email: string, password: string): Promise<TLoginReply>;
    abstract register(d: TUser & { password: string }): Promise<{message: string}>;
    abstract resendEmailConfirmation(email: string): Promise<void>;
    abstract confirmEmail(token: string): Promise<void>

    getHelp(route: string): Promise<string> {
        return axios
            .get(`${Provider.constructUrlBase(this.options)}/help/get/${route}`)
            .then((res) => {
                console.log("GOT MD");
                return res.data;
            })
            .catch((err) => {
                return "# No help available for this page.";
            });
    }

    // TODO: all possible APIs that are ours go here (e.g., getScan, scanProject, getProjects, etc.)
    static checkForLocalServer() {
        // TODO: check if there is a local server running and check version
        // TODO: toast with error if version mismatch
        return false;
    }

    /**
     * Construct the base of the url, example: ```http://localhost:8080``` or ```https://whichlicense.com```
     * @NOTE DOES NOT ADD THE TRAILING SLASH!
     */
    static constructUrlBase(options: ProviderOptions) {
        return `${options.secure ? 'https' : 'http'}://${options.host}${options.port ? `:${options.port}` : ''}`;
    }

    free() {
        this.signalSocket.close();
        this.onSignal.clear();
    }

    onProviderSignal(cb: TSignalCallBack) {
        this.onSignal.add(cb);
        return {
            remove: () => this.removeProviderSignal(cb)
        }
    }

    removeProviderSignal(cb: TSignalCallBack) {
        this.onSignal.delete(cb);
    }

}