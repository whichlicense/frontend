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

import { useState } from "react";
import FullScreenLoader from "../components/Loaders/FullScreenLoader";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function ConfirmEmail() {
  const { token } = useParams();
  const auth = useAuthContext();
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState(false);

  useEffectOnce(() => {
    if (!token) return;
    auth
      .confirmEmail(token)
      .then(() => {
        setEmailVerified(true);
      })
      .catch((err) => {
        toast.error(err.response?.data.error || "Failed to confirm email.");
        setError(true);
      });
  });

  return (
    <div>
      {emailVerified ? (
        <h1>Email confirmed!</h1>
      ) : error ? (
        <h1 className="txt-red">Failed to confirm email.</h1>
      ) : (
        <FullScreenLoader message="Confirming email.." />
      )}
    </div>
  );
}
