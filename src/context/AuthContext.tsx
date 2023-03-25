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


import axios, { AxiosResponse } from "axios"
import { createContext, useState, useContext, useMemo } from "react"
import { CONFIG } from "../CONFIG"

export const AuthContext = createContext<{
    user: TUser | null,
    isLoggedIn: () => boolean,
    login: (email: string, password: string) => Promise<any>,
    logout: () => void,
    register: (d: Omit<TUser & {password: string}, 'token'>) => Promise<AxiosResponse<any, any>>,
    isLoggedInMemo: boolean
}>({} as any)

export type TUserToken = {
    token: string
}
export type TUser = {
    firstName: string, lastName?: string, email:string
} & TUserToken
  
  export const AuthContextProvider = (props: any) => {
    const [user, setUser] = useState<TUser | null>(null)

    const isLoggedIn = () => {
        return user !== null
    }

    const isLoggedInMemo = useMemo(()=>user !== null, [user])

    const login = async (email: string, password: string) => {
        return await axios.post(`${CONFIG.gateway_url}/login`, {email, password}).then(res => {
            if (res.data.token) {
                setUser(res.data)
            }
            return res.data;
        })
    }

    const register = async (d: Omit<TUser & {password: string}, 'token'>) => {
        return await axios.post(`${CONFIG.gateway_url}/register`, d);
    }

    const logout = () => {
        setUser(null)
    }

    return (
      <AuthContext.Provider value={{ user, isLoggedIn, login, register, isLoggedInMemo, logout }}>
        {props.children}
      </AuthContext.Provider>
    )
  }
  
  export const useAuthContext = () => useContext(AuthContext)
  