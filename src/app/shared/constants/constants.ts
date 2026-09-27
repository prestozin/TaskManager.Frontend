export const EMAIL_MAX_LENGTH = 255;

export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 100;

export const PASSWORD_MAX_LENGTH = 100;

export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,100}$/;

export const TASK_TITLE_MIN_LENGTH = 3;
export const TASK_TITLE_MAX_LENGTH = 50;
export const TASK_DESCRIPTION_MAX_LENGTH = 500;
export const TASK_SEARCH_MAX_LENGTH = 100;

export const PROFILE_ROLE_MAX_LENGTH = 100;
export const PROFILE_AREA_MAX_LENGTH = 100;
export const PROFILE_ABOUT_MAX_LENGTH = 250;

export const TASK_DESCRIPTION_PREVIEW_LENGTH = 80;

export const TASK_DETAILS_CLOSE_DELAY_MS = 500;

export const TASK_PAGE_SIZE_OPTIONS = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
] as const;