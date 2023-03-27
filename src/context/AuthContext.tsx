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

import axios, { AxiosResponse } from "axios";
import { createContext, useState, useContext, useMemo, useEffect } from "react";
import FullScreenLoader from "../components/Loaders/FullScreenLoader";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import { CONFIG } from "../CONFIG";

export const AuthContext = createContext<{
  user: TUser & {plan: TUserPlan} | null;
  isLoggedIn: () => boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (
    d: Omit<TUser & { password: string }, "token">
  ) => Promise<AxiosResponse<any, any>>;
  refresh: () => Promise<void>;
  isLoggedInMemo: boolean;
  token: string | null;
}>({} as any);

export type TUser = {
  firstName: string;
  lastName?: string;
  email: string;
};

export type TUserPlan = {
  account_id: number;
  leftover_minutes: number;
  plan: number;
  total_minutes: number;
};

export const AuthContextProvider = (props: any) => {
  const [user, setUser] = useState<TUser & {plan: TUserPlan} | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    axios
      .get(`${CONFIG.gateway_url}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      }).catch((e) => {
        logout();
        setLoading(false);
        // TODO: toast error message if required.
      })
  }

  useEffectOnce(() => {
    if (token) {
        fetchUser();
    } else {
      setLoading(false);
    }
  });



  useEffect(() => {
    fetchUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])


  const isLoggedIn = () => {
    return user !== null || token !== null;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isLoggedInMemo = useMemo(() => isLoggedIn(), [user]);

  const login = async (email: string, password: string) => {
    return await axios
      .post(`${CONFIG.gateway_url}/login`, { email, password })
      .then((res) => {
        if (res.data.token) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
        }
        return res.data;
      });
  };

  const register = async (d: Omit<TUser & { password: string }, "token">) => {
    return await axios.post(`${CONFIG.gateway_url}/register`, d);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const refresh = async () => {
    await fetchUser();
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, register, isLoggedInMemo, logout, token, refresh }}
    >
      {loading ? <FullScreenLoader /> : props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
