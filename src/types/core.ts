/**
 * 2025-04-02
 * @author: @FL03
 * @description - core types for the framework
 * @file: core.ts
 */

import * as React from 'react';




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

export type CommonEvents<TElem = HTMLFormElement> =
  | React.MouseEvent<TElem>
  | React.KeyboardEvent<TElem>
  | React.FormEvent<TElem>
  | React.FocusEvent<TElem>
  | React.ChangeEvent<TElem>;

export type FormHandler = React.EventHandler<
  | React.FormEvent<HTMLFormElement>
  | React.KeyboardEvent<HTMLFormElement>
  | React.MouseEvent<HTMLButtonElement>
  | React.MouseEvent<HTMLDivElement>
  | React.MouseEvent<HTMLFormElement>
>;

export type ReactElementEventHandler<TOut = void> = <
  TElem,
  SyntheticEventType extends React.SyntheticEvent<TElem>,
>(
  event: SyntheticEventType
) => TOut;
