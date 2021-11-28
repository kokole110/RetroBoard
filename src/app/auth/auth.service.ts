import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, filter, map } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { User } from './user.model';

import { Firestore, doc, setDoc, addDoc, collection, getDoc } from '@angular/fire/firestore';
import { getDatabase } from '@angular/fire/database';


export interface AuthResponseData {
    idToken:  string, //  A Firebase Auth ID token for the newly created user
    email:  string, //  The email for the newly created user
    refreshToken:  string, //  A Firebase Auth refresh token for the newly created user
    expiresIn:  string, //  The number of seconds in which the ID token expires
    localId:  string, //  The uid of the newly created user
    registered?: boolean, //Whether the email is for an existing account
  }

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  private db = getDatabase();
  constructor(
    private http: HttpClient,
    private router: Router,
    private afs: Firestore) { }

  signup(name: string, email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDzPXIEW8g6dCQKMnGsEDlu_I93DTMynv0',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleSignup(resData.email, resData.localId, resData.idToken, +resData.expiresIn, name)
      })
    )
  };

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDzPXIEW8g6dCQKMnGsEDlu_I93DTMynv0',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleLogin(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      })
    )
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpDate: string,
      name: string,
    } = JSON.parse(localStorage.getItem('userData') || '');

    if (!userData) {
      return
    }
    const loadedUser = new User(
      userData.email, 
      userData.id, 
      userData._token, 
      new Date(userData._tokenExpDate),
      userData.name)

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log(expirationDuration)
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)
  }

  private handleSignup(email: string, userId: string, token: string, expiresIn: number, name: string,) {
    const expDate = new Date(new Date().getTime() + expiresIn*1000)
    const user = new User(email, userId, token, expDate, name)
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));


    setDoc(doc(this.afs, 'users', userId), {
      name: name,
      email: email,
      userId: userId,
      token: token,
      tokenExpirationDate: expDate
    });
    // this.http.post(
    //   'https://retroboard-3862e-default-rtdb.firebaseio.com/users.json',
    //   user
    // ).subscribe(response => {
    //   console.log(response)
    // });

    // addDoc(collection(this.afs, "users"), {
    //   email: email,
    //   userId: userId,
    //   token: token,
    //   tokenExpirationData: expDate
    // }).then(resp => {
    //   console.log("Document written with ID: ", resp.id);
    //   console.log("Document info: ", resp);
    // })
  }

  private handleLogin(email: string, userId: string, token: string, expiresIn: number) {
      const expDate = new Date(new Date().getTime() + expiresIn*1000);
      const docRef = doc(this.afs, "users", userId);
      getDoc(docRef).then(userDoc => {
        if (userDoc.exists()) {
          console.log("Document data:", userDoc.data().name);
          const user = new User(email, userId, token, expDate, userDoc.data().name)
          this.user.next(user);
          this.autoLogout(expiresIn * 1000);
          localStorage.setItem('userData', JSON.stringify(user));

        } else {
          console.log("No such document!");
        }
      });
    }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!'
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch(errorRes.error.error.message) {
      case 'EMAIL_EXISTS': 
        errorMessage = 'This email already exists!';
        break;
      case 'EMAIL_NOT_FOUND': 
        errorMessage = 'There is no user record corresponding to this identifier';
        break;
      case 'INVALID_PASSWORD': 
        errorMessage = 'The password is invalid';
        break;
    }
    return throwError(errorMessage);
  }
}
