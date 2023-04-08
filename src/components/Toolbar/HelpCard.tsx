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

import ReactMarkdown from "react-markdown";
import { useLocation, useParams } from "react-router-dom";
import { InlineCard } from "../Modals/InlineCard";
import { useEffect, useState } from "react";
import { CONFIG } from "../../CONFIG";
import axios from "axios";

const lastLocation = { value: "" };
export function HelpCard(props: { open: boolean; handleClose: () => void }) {
  // TODO: ability to manually set an md file ID via a hook
  const location = useLocation();
  const [md, setMd] = useState("Loading...");

  useEffect(() => {
    const baseRoute = location.pathname.split("/")[1];
    if (lastLocation.value === baseRoute) return;
    lastLocation.value = baseRoute;
    axios
      .get(`${CONFIG.gateway_url}/help/get/${baseRoute}`)
      .then((res) => {
        console.log("GOT MD");
        setMd(res.data);
      })
      .catch((err) => {
        setMd("# No help available for this page.");
      });
  }, [location]);

  return (
    <InlineCard show={props.open} handleClose={() => props.handleClose()}>
      <ReactMarkdown>{md}</ReactMarkdown>
    </InlineCard>
  );
}
