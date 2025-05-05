// links.ts
import { UrlObject } from 'url';

/** A type able to be passed to the `href` property on the `Link` component provided by nextjs. */
export type Url = string | UrlObject;

/** This type defines the basic properties of any navigation link used throughout the project. */
export type LinkAttributes = {
  href: Url;
  icon?: React.ReactNode;
  label?: React.ReactNode;
};
/** This type extends the basic `LinkAttributes` type with additional parameters useful for designing static configurations */
export type LinkProps = {
  description?: string;
  name?: string;
} & LinkAttributes;

export type LinkSearchParams = string[][] | { [key: string]: string | string[] | undefined } | URLSearchParams;