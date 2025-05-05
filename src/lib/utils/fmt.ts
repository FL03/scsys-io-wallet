/**
 * Created At: 2025-04-15:13:24:51
 * @author - @FL03
 * @file - fmt.ts
 */
import { Timestamptz } from '@/lib/datetime';

type FormatAsHandler<TData = any, TOut = unknown> = (value?: TData | null) => TOut;

/** Format  */
export const formatAsAccounting: FormatAsHandler<any, React.ReactNode> = (value) => {
  if (!value) return '-';
  return (
    '$\t' +
    Number(value)
      ?.toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  );
};

export const formatAsCurrency: FormatAsHandler<any, string> = (value) => {
  if (!value) return '-';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value));
};

export const formatAsDateString: FormatAsHandler<Timestamptz, string> = (value) => {
  if (!value) return '-';

  return new Date(value).toLocaleDateString('en-us', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};
