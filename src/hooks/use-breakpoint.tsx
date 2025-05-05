import * as React from 'react';


export type BreakpointState = {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
}

export const useBreakpoint = (): BreakpointState => {
  const [width, setWidth] = React.useState<number>(0);

  const onWidthChange = React.useCallback(
    (w: number) => {
      setWidth(w);
    },
    [setWidth]
  );

  const onWindowResize = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      onWidthChange(window.innerWidth);
    }
  }, [onWidthChange]);

  React.useEffect(() => {
    onWindowResize();
    // set the initial width
    window?.addEventListener('resize', onWindowResize);
    return () => {
      // cleanup the event listener on unmount
      window?.removeEventListener('resize', onWindowResize);
    };
  }, [onWindowResize]);
  // returns a memoized object containing the breakpoints
  return React.useMemo<BreakpointState>(
    () => ({
      xs: width < 480,
      sm: width >= 480 && width < 768,
      md: width >= 768 && width < 1024,
      lg: width >= 1024 && width < 1280,
      xl: width >= 1280,
      desktop: width < 1280,
      mobile: width < 768,
      tablet: width >= 768 && width < 1280,
    }),
    [width]
  );
};
