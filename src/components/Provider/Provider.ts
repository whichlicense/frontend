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

export type ProviderOptions = {
    host: string;
    port: number;
}

export enum ProviderType {
    LOCAL,
    CLOUD
}

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

        this.signalSocket = new WebSocket(`ws://${options.host}:${options.port}/socket/signals`);

        this.signalSocket.addEventListener("open", () => {
            console.log("Signal socket opened");
            this.signalSocket.send(savedToken || "NA");
        })

        this.signalSocket.addEventListener("message", async (event) => {
            const d = JSON.parse(event.data) as { type: ESignalType, data: any };
            if(d.type === ESignalType.NOTIFICATION && d.data?.message){
                toast.info(d.data.message)

                if(!document.hasFocus()){
                    let permission = await Notification.requestPermission();
                    if(permission === "granted") {
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
            console.log("Received signal in Provder.ts", d);
            for(const cb of this.onSignal) {
                cb(d.type, d.data);
            }
        })

        this.onSignal = new Set();
    }

    // TODO: define type
    abstract getScan(id: string): Promise<any>;

    /**
     * Get the type of the logged in account.
     * Can be used to filter out content that is not relevant to the account type.
     */
    getLoggedInAccountType(): AccountType {
        // TODO: implement me.
        return AccountType.ALL;
    }

    // TODO: all possible APIs that are ours go here (e.g., getScan, scanProject, getProjects, etc.)
    static checkForLocalServer() {
        // TODO: check if there is a local server running and check version
        // TODO: toast with error if version mismatch
        return false;
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