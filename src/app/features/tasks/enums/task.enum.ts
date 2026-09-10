export enum ETaskSort {
    CreatedAt = 'CreatedAt',
    TaskStatus = 'TaskStatus',
    TaskPriority = 'TaskPriority'
}

export enum ETaskStatus {
    Pending = 1,
    InProgress = 2,
    Completed = 3,
    Canceled = 4,
}

export enum ESortOrder {
    Asc = 'asc',
    Desc = 'desc'
}