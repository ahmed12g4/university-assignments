import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * دمج الكلاسات بشكل ذكي (shadcn style)
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
