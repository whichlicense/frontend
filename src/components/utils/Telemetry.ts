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
import { v4 as uuidv4 } from 'uuid';


export enum ETelemetryEntryType {
    /**
     * react-router location change.
     */
    LOCATION_CHANGE,
    /**
     * Application is loaded (i.e., the starting point).
     * The caveat here is that the "LOAD" is added when the telemetry object is constructed.
     */
    LOAD,
    /**
     * The TAB/page is in focus.
     * Can be used to remove time that the user spends away from the page from the analysis.
     */
    PAGE_FOCUS,
    /**
     * The TAB/page is out of focus (i.e., the user switched to another TAB).
     * Can be used to remove time that the user spends away from the page from the analysis.
     */
    PAGE_BLUR,
    /**
     * User interaction (click, touch or gesture) with the application.
     */
    INTERACTION
}
export type TTelemetryEntry = {
    type: ETelemetryEntryType,
    /**
     * Used to measure distance between two entries.
     */
    timestamp: number,
    /**
     * Title of the interaction. For example, "Help pressed" or "Add project open".
     * This will be used in constructed diagrams and reports.
     */
    title: string,
    /**
     * Indicates where the user is when the entry is added.
     * > This is not to be confused with the LOCATION_CHANGE entry type. This is the URL, in path format, of the CURRENT page
     * So as an example, if the location is changing to X and we are on Y, the URL will be Y and the description will contain X.
     */
    url: string,
    /**
     * Description of the interaction in textual format. For example,
     * "Clicked on button 'Save'" or "navigation to '/Home/something'".
     * This may get used as "notes" in diagrams or reports where applicable.
     */
    description?: string,
}

export class Telemetry {
    private static _instance: Telemetry;
    private entries: TTelemetryEntry[];
    public sessionId: string;

    private constructor() {
        console.info("Telemetry object constructed");
        this.entries = [];
        this.sessionId = uuidv4();
        this.addEntry({ type: ETelemetryEntryType.LOAD, title: "Application loaded" });
    }
    public addEntry(entry: Omit<Omit<TTelemetryEntry, 'url'>, 'timestamp'>) {
        // should be faster than spreading the object.
        this.entries.push(Object.assign(entry, { url: window.location.pathname, timestamp: Date.now() }));
    }
    public getEntries() {
        return this.entries;
    }

    public static get instance(): Telemetry {
        if (!Telemetry._instance) {
            Telemetry._instance = new Telemetry();
        }

        return Telemetry._instance;
    }

}