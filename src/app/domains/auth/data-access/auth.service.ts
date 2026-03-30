import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SignInApiParams, SignInParams, User } from '../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:8080/api/auth';

  http = inject(HttpClient);

  signUp(
    username: string,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    socialMediaHandle?: string
  ) {
    return this.http.post(`${this.url}/signup`, {
      username,
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      password,
      socialMediaHandle,
    });
  }

  signIn({email,password}: SignInApiParams):Observable<any> {
    return this.http.post(`${this.url}/signin`,{email, password}, {withCredentials:true});
  }

  signOut() {
    return this.http.post(`${this.url}/signout`, {withCredentials:true})
  }
}

export const loadUserFromStorage = (): User | undefined => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : undefined;
  } catch (error) {
    console.error('Error loading user from local storage', error);
    return undefined;
  }
};
