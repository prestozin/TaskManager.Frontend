export interface ProfileResponse {
    name: string;
    email: string;
    role: string | null;
    area: string | null;
    about: string | null;
    createdAt: string;
}

export interface EditProfileRequest {
    name: string;
    role: string | null;
    area: string | null;
    about: string | null;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}