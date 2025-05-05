/**
 * Created At: 2025-04-04:16:35:13
 * @author - @FL03
 * @file - error-boundary.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import logger from '@/lib/logger';

export class ErrorBoundary extends React.PureComponent<
  React.PropsWithChildren<{}>,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    logger.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col flex-1 w-full min-h-full">
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold tracking-tight">Error</h2>
            <span className="text-muted-foreground">Something went wrong.</span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
