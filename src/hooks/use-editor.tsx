'use client';
// imports
import * as React from 'react';
// project
import { logger } from '@/lib/logger';


/**
 * A custom hook used to manage the state and behavior of a content editor.
 * @returns 
 * 
 */
export const useContentEditor = () => {
  const [_data, setData] = React.useState<any>(null);

  return React.useMemo(() => ({}), []);
}