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


/*
    This file includes the entire database schema to be used with the query building system.
    By providing the schema, the query builder can provide type safety for the queries.
*/

export enum EAccountPlan {
  Basic,
  Unlimited,
  Dev
}

// TODO: notification stuff? webhook url per acc? email per acc?..
// TODO: account settings? -> per account!
// TODO: Account X resolved/rejected dependency Y? how to store this? -> per account!

export interface AccountSettingsTable {
  id: number;
  /**
   * References ```AccountTable.id```
   */
  account_id: number;
}
export interface AccountPlanTable {
  id: number;
  /**
   * References ```AccountTable.id```
   */
  account_id: number;
  leftover_minutes: number;
  total_minutes: number;
  /**
   * Type of plan. can be used to sort each month and bill the user accordingly.
   * > enum
   */
  plan: EAccountPlan;
}
export interface SubAccountTable {
  // TODO: sub account access rights? -> for example: sub accounts can scan or not
  id: number;
  /**
   * References ```AccountTable.id```
   */
  account_id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  password: string;
  /**
   * The expertise of the user. for example:
   *  - ```Legal```
   * - ```Compliancy```
   * - ```Management```
   * - ```ALL  (for all expertise)```
   *
   * > Can be used to filter out irrelevant content in the dashboard
   */
  expertise: number;
}
export interface AccountTable {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  password: string;
}

/**
 * This table contains the details of each plan.
 * > ## NOTE!: Changing the IDs of this table will break plans selected by users. Only add new plans to the end of the list!.
 */
export interface PlanDetailsTable {
  /**
   * Unique.. identifies the type of plan.
   */
  id: EAccountPlan;
  name: string;
  description: string;
  /**
   * Indicates if this plan is available for purchase or not.
   * Can be set to false to keep certain users on the legacy plan.
   */
  available: boolean;


  /**
   * References ```OrderInventoryTable.id```
   */
  order_inventory_id: string;
}

export interface TopUpOptionsTable {
    id: number;
    minutes: number;
    /**
     * References ```OrderInventoryTable.id```
    */
    order_inventory_id: string;
  }

/**
 * All available payment items within our system shall appear in this table.
 * It is the intention that other tables making use of price information shall reference this table.
 */
export interface OrderInventoryTable {
  id: string;
  price: number;
}