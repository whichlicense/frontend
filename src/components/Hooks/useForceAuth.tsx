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
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export enum AuthState {
  LOGGED_IN,
  LOGGED_OUT,
}

/**
 * Forces the user to be authenticated or not before the page is rendered.
 * Will redirect to the supplied page if the user is not of the given auth state.
 * Requires the use of the AuthContext thus the use of the AuthContextProvider.
 */
export function useForceAuth(props: { ifState: AuthState; travelTo: string }) {
  const auth = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      (auth.isLoggedIn() && props.ifState === AuthState.LOGGED_IN) ||
      (!auth.isLoggedIn() && props.ifState === AuthState.LOGGED_OUT)
    ) {
      navigate(props.travelTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, auth.user]);
}
