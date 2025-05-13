/**
 * Created At: 2025.05.12:23:35:24
 * @author - @FL03
 * @file - core.ts
 */

export type Nullish<T = unknown> = T | null | undefined;

export enum Crud {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type CrudLiteral = 'create' | 'read' | 'update' | 'delete';

export type AsyncCallback<T = unknown, O = void> = (args: T) => Promise<O>;

export type SetAction<T> =
  | T
  | ((prev: T) => T)
  | ((prev: T) => Promise<T> | PromiseLike<T>);

export type MaybeAsync<T = unknown> = T | Promise<T> | PromiseLike<T>;

export type SetStateChangeHandler<TValue = unknown> = (
  value?: SetAction<TValue>
) => MaybeAsync<void>;

export type ChangeHandler<TValue extends any = unknown, TOut = void> = (
  value?: SetAction<TValue>
) => MaybeAsync<TOut>;

export type MaybeAsyncHandler<TParams, TOut> = (
  params?: TParams
) => MaybeAsync<TOut>;

export type NextMetaGenerator<TProps = any> = (
  props: TProps,
  parent: import('next').ResolvingMetadata
) => Promise<import('next').Metadata>;

