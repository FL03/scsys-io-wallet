/**
 * Created At: 2025.05.02:22:11:57
 * @author - @FL03
 * @file - num.ts
 */

/** 
 * sum a particular field in an array of objects
 * 
 * @param {TKey} key - The field, or key, to perform the calculation on.
 * @param {TData[]} values - Any uniform iterator of a particular object equipped with the specific field.
 * @returns {number} returns the average of a set of objects using a particular field.
 */
export const sumBy = <TData, TKey extends keyof TData>(
  key: TKey,
  values: TData[]
): number => {
  return values.reduce((acc, item) => acc + Number(item[key]), 0);
};

/** 
 * Calculate the average of a particular field in an array of objects.
 * 
 * @param {TKey} key - The field, or key, to perform the calculation on.
 * @param {TData[]} values - Any uniform iterator of a particular object equipped with the specific field.
 * @returns {number} returns the average of a set of objects using a particular field.
*/
export const averageBy = <TData, TKey extends keyof TData>(
  key: TKey,
  ...values: TData[]
): number => sumBy(key, values) / values.length;

/**
 * 
 * @param {string} key - The field, or key, to perform the calculation on.
 * @param {any[]} values - Any uniform iterator of a particular object equipped with the specific field.
 * @returns 
 */
export const countBy = (
  key: string,
  values: any[]
): Array<{ name: string; value: number }> => {
  const result = values.reduce((acc, item) => {
    const value = item[key];
    if (!acc[value]) {
      acc[value] = 1;
    }
    acc[value]++;
    return acc;
  }, {});
  return Object.keys(result).map((key) => ({
    name: key,
    value: result[key],
  }));
};;

export const groupBy = (
  key: string,
  values: any[]
): any[] => {
  return values.reduce((acc, item) => {
    const value = item[key];
    if (!acc[value]) {
      acc[value] = [];
    }
    acc[value].push(item);
    return acc;
  }, {});
};;

export const uniqueBy = <TData, TKey extends keyof TData>(key: TKey, values: TData[]) => {
  return Array.from(new Set(values.map((item) => item[key])).values());
};

