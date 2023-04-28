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
import { Button, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import RegularCard from "../components/Cards/RegularCard";
import { AuthState, useForceAuth } from "../components/Hooks/useForceAuth";
import { useToolBar } from "../components/Hooks/useToolBar";
import { useAuthContext } from "../context/AuthContext";
import { ToolBarItemType } from "../context/ToolBarContext";
import { toast } from "react-toastify";


export function Login() {
    useForceAuth({ ifState: AuthState.LOGGED_IN, travelTo: "/dashboard" })
    const [emailNotVerified, setEmailNotVerified] = useState<boolean>(false);
    
    useToolBar([
        {
            type: ToolBarItemType.BUTTON,
            title: "Create a new account",
            onClick: () => {
                navigate("/register");
            }
        }
    ])
    const auth = useAuthContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const onLogin= () => {
        auth.login(email, password).catch((err) => {
          toast.error(err.response.data.error || "Login failed. Check credentials and try again.")
          if(err.response.data.type === "EMAIL_NOT_VERIFIED") {
            setEmailNotVerified(true);
          }
        });
    }

    const onResendVerificationEmail = () => {
      auth.resendVerificationEmail(email)
      .then((res) => {
        toast.success(res.data || "Verification email sent. Please check your inbox.")
      })
      .catch((err) => {
        toast.error(err.response?.data.error || "Failed to send verification email. Please try again later.")
      });
    }
  return (
    <>
      <RegularCard maxHeight="100%">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email address<span className="txt-deep-red">*</span></Form.Label>
            <Form.Control onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password<span className="txt-deep-red">*</span></Form.Label>
            <Form.Control onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" />
          </Form.Group>

          <Stack direction="horizontal" gap={2}>
          <Button onClick={onLogin}>
            Login
          </Button>
          {emailNotVerified && (
            <Button className="bg-green txt-dark-1" onClick={onResendVerificationEmail}>
              Resend verification email
            </Button>
          )}
          </Stack>
        </Form>
      </RegularCard>
    </>
  );
}
