import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  const user = authService.getCurrentUser();

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    })
  }
  if (!user) {
    return true;
  }

  if (!allowedRoles || allowedRoles.includes(user.roleName)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
