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
// @ts-ignore
import * as html2pdf from "html2pdf.js";

/**
 * @deprecated
 */
export function downloadPdf(elementRef: React.MutableRefObject<any>, opts: {fileName: string}){
    const element = elementRef.current;
    const options = {
      margin: 0,
      filename: opts.fileName,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      enableLinks: true,
    };
    html2pdf().set(options).from(element).save();
}


export function downloadPlainText(fileName: string, contents: string) {
  const e = document.createElement('a');
  e.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
  e.setAttribute('download', fileName);

  e.style.display = 'none';
  document.body.appendChild(e);

  e.click();

  document.body.removeChild(e);
}