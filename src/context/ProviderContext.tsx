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

import { createContext, useState, useContext, useEffect } from "react"
import { CloudProvider } from "../components/Provider/CloudProvider"
import { LocalProvider } from "../components/Provider/LocalProvider"
import { Provider, ProviderType } from "../components/Provider/Provider"
import { useEffectOnce } from "../components/utils/useEffectOnce"

export const ProviderContext = createContext<{
    provider: Provider | null,
    setProvider: React.Dispatch<React.SetStateAction<Provider | null>>,
    getProviderType: () => ProviderType
}>({} as any)
  
  export const ProviderContextProvider = (props: any) => {
    const [provider, setProvider] = useState<Provider | null>(null as any);

    useEffectOnce(() => {
      setProvider(
        new CloudProvider({
          host: CloudProvider.defaultHost, // TODO: point to actual cloud
          port: CloudProvider.defaultPort, // TODO: point to actual cloud port
        })
        // new LocalProvider({
        //   host: "192.168.1.130", // TODO: point to actual cloud
        //   port: 8080, // TODO: point to actual cloud port
        // })
      )
    })

    // TODO: what if we log-out and log-in with a different user? does the provider need to be re-created?

    const getProviderType = () => {
      return provider instanceof CloudProvider ? ProviderType.CLOUD : ProviderType.LOCAL
    }

    useEffect(() => {
      return () => {
        provider?.free()
      }
    }, [provider])



    return (
      <ProviderContext.Provider value={{ provider, setProvider, getProviderType }}>
        {props.children}
      </ProviderContext.Provider>
    )
  }
  
  export const useProviderContext = () => useContext(ProviderContext)
  