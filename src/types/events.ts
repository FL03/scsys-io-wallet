/**
 * Created At: 2025.05.12:23:35:36
 * @author - @FL03
 * @file - events.ts
 */
import * as React from 'react';

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