export const getRelativeTime = (dateString: string) => {
    const createdTime = new Date(dateString).getTime();
    const now = new Date().getTime();

    if (Number.isNaN(createdTime)) return '';

    const diffMs = now - createdTime;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    if (diffMs < minute) return '방금 전';
    if (diffMs < hour) return `${Math.floor(diffMs / minute)}분 전`;
    if (diffMs < day) return `${Math.floor(diffMs / hour)}시간 전`;
    if (diffMs < week) return `${Math.floor(diffMs / day)}일 전`;
    if (diffMs < month) return `${Math.floor(diffMs / week)}주 전`;
    if (diffMs < year) return `${Math.floor(diffMs / month)}개월 전`;
    return `${Math.floor(diffMs / year)}년 전`;
};