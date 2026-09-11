import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * `clsx` handles conditionals/arrays; `twMerge` ensures a later utility
 * (e.g. an overridden padding from `className`) wins over an earlier one.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
