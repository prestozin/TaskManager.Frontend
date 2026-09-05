export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    name: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
}