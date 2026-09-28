import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoadingService } from '@core/services/loading/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
    const loadingService = inject(LoadingService);

    const minimumLoadingTime = 500;
    const startTime = Date.now();

    loadingService.show();

    return next(request).pipe(
        finalize(() => {
            const elapsedTime = Date.now() - startTime;

            const remainingTime = Math.max(minimumLoadingTime - elapsedTime,0);

            setTimeout(() => {
                loadingService.hide();
            }, remainingTime);
        })
    );
};