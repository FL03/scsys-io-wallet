/**
 * Created At: 2025-04-13:13:36:56
 * @author - @FL03
 * @file - props.ts
 */

import React from "react";

export type AsChild = { asChild?: boolean };

export type AsChildProps<T> = T & AsChild 
/** A simple type literal for the four sides of a 2-dimensional surface; i.e. left, right, top, bottom. */
export type LRTB = 'left' | 'right' | 'top' | 'bottom';


export type BaseFormProps<TData = unknown> = {
  defaultValues?: Partial<TData>;
  values?: TData;
  onCancel?: () => void;
  onError?: (error: Error) => void;
  onSubmit?: (values?: TData) => void;
  onSubmitSuccess?: (values: TData) => void;
} & AsChild;

export type StandardFormProps<TData = unknown> = BaseFormProps<TData> & Omit<React.ComponentPropsWithRef<'form'>, 'children' | 'title' | 'onSubmit'>

export type FormOverlayProps<T = any> = {
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
  showLabel?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
} & BaseFormProps<T>;