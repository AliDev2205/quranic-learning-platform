/**
 * Helper to handle French pluralization rules
 * In French, 0 and 1 are singular, 2 or more are plural.
 * 
 * @param count The number of items
 * @param singular The singular form of the word
 * @param plural The plural form of the word (defaults to singular + 's')
 * @returns The correctly inflected word
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
    const isPlural = Math.abs(count) >= 2;
    if (isPlural) {
        return plural || `${singular}s`;
    }
    return singular;
};

/**
 * Formats a count with its correctly inflected label
 * Example: formatCount(1, 'exercice') => "1 exercice"
 * Example: formatCount(2, 'exercice') => "2 exercices"
 * 
 * @param count The number of items
 * @param singular The singular form
 * @param plural The plural form
 * @returns Formatted string
 */
export const formatCount = (count: number, singular: string, plural?: string): string => {
    return `${count} ${pluralize(count, singular, plural)}`;
};
