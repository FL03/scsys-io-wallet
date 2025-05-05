'use client';

import * as React from 'react';


type UseListOptions<TData> = {
  handleOnChange?: (data: TData[]) => void;
}
/**
 * A hook designed for the `list-view` component to manage a set of items.
 * @param {TData[]} values -The set of values to be managed by the hook.
 * @returns 
 */
export function useList<TData>(values: TData[], options?: UseListOptions<TData>) {
  // declare stateful variables for the data
  const [_data, _setData] = React.useState<TData[]>(values);

  // redeclare public variables and methods
  const data = _data;
  const setData = _setData;

  // base effects
  React.useEffect(() => {}, []);

  return React.useMemo(() => ({
    data,
    setData,
  }), [data, setData]);
}