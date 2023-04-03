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
import { useEffectOnce } from "../utils/useEffectOnce";


export function useSignal(props: {
    signal: ESignalType,
    callback: <T>(data: T) => void
}){
    const providerCtx = useProviderContext();
    const { signal, callback } = props;

    useEffect(()=>{
        const signalListener = providerCtx.provider?.onProviderSignal((signalType, data)=>{
            console.log("useSignal: signal", signalType, signalType === signal)
            if(signalType === signal){
                callback(data)
            }
        });
        return () => {
            console.log("useSignal: remove signal", signal)
            signalListener?.remove();
        }
    }, [providerCtx])
}