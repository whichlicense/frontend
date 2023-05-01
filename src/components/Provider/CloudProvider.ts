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
import { AccountType } from "../typings/Account";
import { TScanInitiationOptions } from "../typings/Scan";
import { Provider } from "./Provider";

/**
 * Represents a connection system towards the cloud hosted solution.
 */
export class CloudProvider extends Provider {
    getScan(id: string): Promise<any> {
        throw new Error("Method not implemented.");
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
            toast.error(e?.data?.error || "Something went wrong");
          });
    }
}