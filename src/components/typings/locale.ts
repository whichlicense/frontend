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
 * Represents a single locale entry for a given language.
 * Contains the information one needs to pick from.
 */
export type TLocaleEntry = {
    /**
     * Human readable version of the key.
     */
    text: string;
  };
  
  /**
   * Type that aims to allow the mapping of database and object keys to a human readable text version.
   * Also supports adding units and icons for easy access in the UI.
   */
  export type TLocaleMapping = {
    /**
     * Unreadable version of the key, also known as the identifier key.
     * example: ```on_new_scan_initiated```
     */
    [key: string]: {
      en: TLocaleEntry;
    };
  };