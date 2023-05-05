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

import { createContext, useState, useContext } from "react"
import { TLocaleEntry, TLocaleMapping } from "../components/typings/locale";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import { useProviderContext } from "./ProviderContext";

export const LocaleContext = createContext<{
    localeMap: TLocaleMapping,
    selectedLocale: string,
    setSelectedLocale: React.Dispatch<React.SetStateAction<string>>,
    resolve: (key: string) => TLocaleEntry,
}>({} as any)
  
  export const LocaleContextProvider = (props: any) => {
    const [localeMap, setLocaleMap] = useState<TLocaleMapping>({});
    const [selectedLocale, setSelectedLocale] = useState<string>('en');
    const {provider} = useProviderContext();

    useEffectOnce(()=>{
        provider.getLocaleMappings().then(setLocaleMap);
    })

    const resolve = (key: string): TLocaleEntry => {
        return ((localeMap[key] as Record<string, TLocaleEntry>)?.[selectedLocale]) || {
            text: key,
        };
    }

    return (
      <LocaleContext.Provider value={{ localeMap, selectedLocale, setSelectedLocale, resolve }}>
        {props.children}
      </LocaleContext.Provider>
    )
  }
  
  export const useLocaleContext = () => useContext(LocaleContext)
  