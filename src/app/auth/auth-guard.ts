import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Router, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService,
		private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot, 
		state: RouterStateSnapshot,
		): 
			boolean | 
			UrlTree | 
			Promise<boolean | UrlTree> | 
			Observable<boolean | UrlTree> {
				return this.authService.user.pipe(
					take(1),
					map(user => {
						console.log(user);
						const isAuth = !!user;
						if(isAuth) {
							console.log(isAuth);
							return true;
						}
						return this.router.createUrlTree(['/auth'])
					}),
			)
	}
}