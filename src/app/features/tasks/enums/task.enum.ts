export enum ETaskSort {
    CreatedAt = 'CreatedAt',
    TaskStatus = 'TaskStatus',
    TaskPriority = 'TaskPriority'
}

export enum ETaskStatus {
    Pending = 1,
    InProgress = 2,
    Completed = 3,
    Canceled = 4
}

export enum ETaskPriority {
    Low = 1,
    Medium = 2,
    High = 3
}

export enum ETaskFilter {
    All = 0
}

export enum ETaskFormMode {
    Create = 'create',
    Edit = 'edit'
}

export enum ETaskModal {
    Create = 'create',
    Edit = 'edit',
    View = 'view',
    Delete = 'delete',
    DeleteChecked = 'deleteChecked'
}

export enum ESortOrder {
    Asc = 'asc',
    Desc = 'desc'
}
