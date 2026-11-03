export function getISOWeekKey(date: Date): string {
    const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ));

    const dayNumber = utcDate.getUTCDay() || 7;

    utcDate.setUTCDate(
        utcDate.getUTCDate() + 4 - dayNumber
    );

    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));

    const week = Math.ceil(
        (((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7
    );

    return `${week}`;
}

export function getDayIndex(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
}