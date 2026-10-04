import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoadingService } from '@core/services/loading/loading.service';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
    const loadingService = inject(LoadingService);

    if (request.context.get(SKIP_LOADING))
        return next(request);

    loadingService.show();

    return next(request).pipe(
        finalize(() => loadingService.hide())
    );
};