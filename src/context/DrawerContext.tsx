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
import { useEffectOnce } from "../components/utils/useEffectOnce";


export const DrawerContext = createContext<{
    open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({} as any)
  
  export const DrawerContextProvider = (props: any) => {
    const openPoint = 1182;
    const [open, setOpen] = useState(window.innerWidth >= openPoint);

    window.addEventListener('resize', () => {
      if (window.innerWidth >= openPoint) {
        setOpen(true)
      } else {
        setOpen(false)
      }
    })

    return (
      <DrawerContext.Provider value={{ open, setOpen }}>
        {props.children}
      </DrawerContext.Provider>
    )
  }
  
  export const useDrawerContext = () => useContext(DrawerContext)
  