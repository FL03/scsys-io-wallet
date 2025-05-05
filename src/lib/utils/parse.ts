/**
 * 2025-04-02
 * @author: @FL03
 * @description:  common coercion routines for the platform
 * @file: coerce.ts
 */

export const parseTags = (tags?: FormDataEntryValue | null): string[] | null => {
  if (!tags) return null;
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim());
  }
  if (typeof tags === 'string') {
    return tags.split(',').map((tag) => tag.trim());
  }
  return null;
};