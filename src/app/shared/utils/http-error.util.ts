import { HttpErrorResponse } from '@angular/common/http';
import { ResultResponse } from '@shared/models/response.models';


export function getHttpErrorMessage(error: HttpErrorResponse): string {
    const response = error.error as ResultResponse<null>;

    return response?.message ?? 'Ocorreu um erro inesperado.';
}