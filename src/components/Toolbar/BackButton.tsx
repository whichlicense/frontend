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

import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/Button.css";

type BackButtonProps = {
  /**
   * Override the default back button url. React-router naming convention must be adhered to.
   */
  overrideUrl?: string;
};
export default function BackButton(props: BackButtonProps) {
  // TODO: lower opacity a bit when scroll starts
  // TODO: remove 'back' text on mobile
  // TODO: add full name of previous page on back when on larger screens
  const navigate = useNavigate();

  const goBack = () => {
    if (props.overrideUrl) {
      navigate(props.overrideUrl);
    } else {
      navigate(-1);
    }
  };
  return (
    <Button
      className={`bg-purple text-dark page-back-button shadow-sm`}
      onClick={goBack}
    >
      <Stack direction="horizontal">
        <i className={`bi bi-caret-left-fill txt-dark-1`}></i>
        <div className="txt-dark-1">Back</div>
      </Stack>
    </Button>
  );
}
