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


import { useEffect } from "react";
import { useProviderContext } from "../../context/ProviderContext";
import { ESignalType } from "../Provider/Provider";

export function useSignal(props: {
    signal: ESignalType,
    callback: <T>(data: T) => void
}){
    const providerCtx = useProviderContext();
    const { signal, callback } = props;

    useEffect(()=>{
        const ws = new WebSocket(`ws://localhost:${8084}/observed`);
        const receiver = (event: MessageEvent<any>) => {
            console.log("Signal received", event.data);
            const d = JSON.parse(event.data) as { type: ESignalType, data: any };
            if(d.type === signal){
                callback(d.data);
            }
        }
        ws.addEventListener("message", receiver);


        // const signalListener = providerCtx.provider?.onProviderSignal((signalType, data)=>{
        //     console.log("providerCtx.provider?.onProviderSignal", data)
        //     if(signalType === signal){
        //         callback(data)
        //     }
        // });

        // console.log("Signal listener", providerCtx.provider.onSignal);
        return () => {
            // signalListener?.remove();
            ws.removeEventListener("message", receiver);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, providerCtx.provider, signal])
}