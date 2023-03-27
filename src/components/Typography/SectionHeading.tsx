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

type TSectionHeadingProps = {
  title: string;
  size: "1" | "2" | "3" | "4" | "5" | "6";
  subtitle?: string;
  divider?: boolean;
  type?: "h" | "display";
};
export default function SectionHeading(props: TSectionHeadingProps) {
  return (
    <div>
        {props.divider && <hr className="text-muted" />}
      <h2 className={`${props.type+"-" || "h"}${props.size} mb-0`}>{props.title}</h2>
      {props.subtitle && <small className="text-muted">{props.subtitle}</small>}
    </div>
  );
}
