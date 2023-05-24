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

export class DoublyLinkedListNode<T> {
    public value: T;
    public next: DoublyLinkedListNode<T> | null = null;
    public prev: DoublyLinkedListNode<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }
}

export class DoublyLinkedList<T> {
    private head: DoublyLinkedListNode<T> | null = null;
    private tail: DoublyLinkedListNode<T> | null = null;
    private size = 0;

    constructor(values?: T[]) {
        if (values) {
            this.addAll(values);
        }
    }

    public getSize(): number {
        return this.size;
    }

    public getHead(): DoublyLinkedListNode<T> | null {
        return this.head;
    }

    public getTail(): DoublyLinkedListNode<T> | null {
        return this.tail;
    }

    public add(value: T): DoublyLinkedListNode<T> {
        const node = new DoublyLinkedListNode<T>(value);

        if (!this.head) {
            this.head = node;
            this.tail = node;
            this.size++;
            return node;
        }

        this.tail!.next = node;
        node.prev = this.tail;
        this.tail = node;
        this.size++;
        return node;
    }

    public addAll(values: T[]): void {
        for (const value of values) {
            this.add(value);
        }
    }

    public remove(node: DoublyLinkedListNode<T>): void {
        if (node === this.head) {
            this.head = this.head.next;
            this.head!.prev = null;
            this.size--;
            return;
        }

        if (node === this.tail) {
            this.tail = this.tail.prev;
            this.tail!.next = null;
            this.size--;
            return;
        }

        node.prev!.next = node.next;
        node.next!.prev = node.prev;
        this.size--;
    }

    public forEach(callback: (node: DoublyLinkedListNode<T>) => void): void {
        let current = this.head;
        while (current) {
            callback(current);
            current = current.next;
        }
    }

    public map(callback: (node: DoublyLinkedListNode<T>) => any): any[] {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(callback(current));
            current = current.next;
        }
        return result;
    }
}