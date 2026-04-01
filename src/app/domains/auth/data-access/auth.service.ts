import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SignInApiParams, SignInParams, SignInResponse, User } from '../model/user';
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

  signIn({email,password}: SignInApiParams):Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.url}/signin`,{email, password}, {withCredentials:true});
  }

  signOut() {
    return this.http.post(`${this.url}/signout`, {withCredentials:true})
  }
}

export const loadSessionFromStorage = (): SignInResponse | undefined => {
  try {
    const storedSession = localStorage.getItem('authSession');
    return storedSession ? JSON.parse(storedSession) : undefined;
  } catch (error) {
    console.error('Error loading session from local storage', error);
    return undefined;
  }
};

export const loadUserFromSession = (): User | undefined => {
  const session = loadSessionFromStorage();
  if (!session) return undefined;
  
  return {
    userId: session.id.toString(),
    username: session.username,
    email: session.email,
    phoneNumber: session.phoneNumber,
    // Provide fallback defaults for fields not included in the response
    firstName: '',
    middleName: '',
    lastName: '',
    password: '',
    socialMediaHandle: '',
    image: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=' + session.username + 'size=64'
  };
};
