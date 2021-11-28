import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

//import { DataStorageService } from '../shared/data-storage.service'
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
    
  constructor(private authService: AuthService, ) {}
  private userSub = new Subscription()
  // onSaveData() {
  //   this.dataStorageService.storeRecipe()
  // }

  // onFetchData() {
  //   this.dataStorageService.fetchRecipes().subscribe();
  // }

  onLogout() {
    this.authService.logout()
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      console.log(user);    
      this.isAuthenticated = !!user;
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}