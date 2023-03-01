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

/**
 * Checks and returns wether the element associated with the provided ref has grown big enough to have a scrollbar
 */
export function hasScrollBar(elem: React.MutableRefObject<any>) {
    const div = elem.current;
    if(!div) return false;
    if (div.scrollHeight > div.clientHeight) {
      return true
    } else {
      return false
    }
}
