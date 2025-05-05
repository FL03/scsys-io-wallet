/**
 * Created At: 2025-04-09:13:21:52
 * @author - @FL03
 * @description -   
 * @file - notification-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
// components
import { NotificationListView } from './notification-list-view';

type ScreenViewProps = {
  className?: string;
}

export const NotificationCenter: React.FC<ScreenViewProps> = ({ className, ...props }) => {
  return (
    <div className={className} {...props}>
      <NotificationListView />
    </div>
  );
}