export function formatDateToApi(date: Date | null): string | null {
    if (!date)
        return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function parseApiDate(date: string | null): Date | null {
    if (!date)
        return null;

    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
}

export function getDateMonthsAgo(monthsAgo: number): string {
    const date = new Date();

    date.setMonth(date.getMonth() - monthsAgo);

    return formatDateToApi(date)!;
}

export function convertLocalDateToUtc(date: string, endOfDay = false): string {
    const [year, month, day] = date.split('-').map(Number);

    const localDate = new Date(
        year,
        month - 1,
        endOfDay ? day + 1 : day
    );

    return localDate.toISOString();
}
