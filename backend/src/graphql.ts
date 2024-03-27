
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateTasksInput {
    id?: Nullable<string>;
    v: number;
    description: string;
    name: string;
    parameters: string;
    schedule: string;
    status: string;
    type: string;
}

export interface IQuery {
    ping(): Nullable<string> | Promise<Nullable<string>>;
}

export interface Tasks {
    id?: Nullable<string>;
    v?: Nullable<number>;
    description?: Nullable<string>;
    name?: Nullable<string>;
    parameters?: Nullable<string>;
    schedule?: Nullable<string>;
    status?: Nullable<string>;
    type?: Nullable<string>;
}

export interface IMutation {
    createTasks(createTasksInput: CreateTasksInput): Tasks | Promise<Tasks>;
}

type Nullable<T> = T | null;
