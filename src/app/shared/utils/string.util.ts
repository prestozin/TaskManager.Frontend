export function normalizeClass(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
}

export function capitalizeFirst(value: string): string {
    if (!value)
        return '';

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function truncateText(value: string, maxLength: number): string {
    if (!value)
        return '';

    if (value.length <= maxLength)
        return value;

    return `${value.slice(0, maxLength)}...`;
}
