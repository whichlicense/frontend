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

import { createContext, useState, useContext, useMemo, useEffect } from "react";
import FullScreenLoader from "../components/Loaders/FullScreenLoader";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import { useSignal } from "../components/Hooks/useSignal";
import { ESignalType } from "../components/Provider/Provider";
import { toast } from "react-toastify";
import { EAccountDomain, TLoginReply, TMeReply } from "../components/typings/Account";
import { useProviderContext } from "./ProviderContext";

export type TUserState =
  | TMeReply
  | null;

export const AuthContext = createContext<{
  user: TUserState;
  isLoggedIn: () => boolean;
  login: (email: string, password: string) => Promise<TLoginReply>;
  resendVerificationEmail: (email: string) => Promise<any>;
  confirmEmail: (token: string) => Promise<any>;
  logout: () => void;
  register: (
    d: Omit<TUser & { password: string }, "token">
  ) => Promise<{message: string}>;
  refresh: () => Promise<void>;
  isLoggedInMemo: boolean;
  token: string | null;
  getDomain: () => EAccountDomain;
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
  const [user, setUser] = useState<TUserState>(null);
  // TODO: do we need state changes on token? or can we just use localStorage.getItem("token")? and indicate login status with a boolean state?
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);
  const { provider } = useProviderContext();

  useSignal({
    signal: ESignalType.MINUTED_CHANGED,
    callback: () => {
      refresh();
    },
  });
  useSignal({
    signal: ESignalType.PLAN_CHANGED,
    callback: () => {
      toast.success("Your plan has been changed");
      refresh();
    },
  });

  const fetchUser = async () => {
    setLoading(true);
    provider.me()
      .then((res) => {
        setUser(res);
        setLoading(false);
      })
      .catch((e) => {
        logout();
        setLoading(false);
      });
  };

  useEffectOnce(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const isLoggedIn = () => {
    return user !== null || token !== null;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isLoggedInMemo = useMemo(() => isLoggedIn(), [user]);

  const login = async (email: string, password: string) => {
    return provider.login(email, password)
      .then((res)=>{
        if (res.token) {
          setToken(res.token);
          localStorage.setItem("token", res.token);
        }
        return res
      })
  };

  const resendVerificationEmail = async (email: string) => {
    return await provider.resendEmailConfirmation(email);
  };

  const confirmEmail = async (token: string) => {
    return await provider.confirmEmail(token);
  };

  const register = async (d: TUser & { password: string }) => {
    return await provider.register(d);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const refresh = async () => {
    console.log("refreshing auth");
    await fetchUser();
  };

  const getDomain = () => {
    return user?.domain || EAccountDomain.ALL;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        register,
        isLoggedInMemo,
        logout,
        token,
        refresh,
        resendVerificationEmail,
        confirmEmail,
        getDomain
      }}
    >
      {loading ? <FullScreenLoader /> : props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
