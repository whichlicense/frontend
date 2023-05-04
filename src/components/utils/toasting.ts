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

import { toast } from "react-toastify";

export function toastError(err: any, defaultMessage: string){
    toast.error(typeof err === "string" ? err : (err?.data?.error || err?.response?.data?.error || defaultMessage));
}

export function toastResult(of: Promise<{ message?: string } | string>, options = {
    defaultSuccessMessage: "Success!",
    defaultErrorMessage: "Something went wrong. Please try again later."
}) {
    of.then((res) => {
        toast.success(typeof res === "string" ? res : res.message || options.defaultSuccessMessage);
    }).catch((err) => {
        toastError(err, options.defaultErrorMessage)
    })
}