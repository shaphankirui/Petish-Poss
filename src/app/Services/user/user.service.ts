import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/app/Environments/environment';
import { UserInterface } from 'src/app/Interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  allUsers$ = new BehaviorSubject<UserInterface[]>([]);

  constructor(
    private httpClient: HttpClient,
    private notificationService: HotToastService,
    private router: Router,
    private authService: AuthService 
  ) { }

  getAllUsers() {
    return new Promise<UserInterface[]>((resolve, reject) => {
      this.httpClient.get<UserInterface[]>(`${environment.apiRootUrl}/users`).pipe(take(1)).subscribe({
        next: (data) => {
          this.allUsers$.next(data);
          resolve(data);
        },
        error: (err) => {
        },
      });
    })
  }
  getCurrentUser(): Observable<UserInterface | null> {
    return this.authService.getCurrentUser();
  }

  registerUser(user: Partial<UserInterface>) {
    return new Promise<boolean>((resolve, reject) => {
      this.httpClient.post(`${environment.apiRootUrl}/register`, user).pipe(take(1)).subscribe({
        next: (data: any) => {
          if (data) {
            if (data.message === 'success') {
              this.getAllUsers();
              this.notificationService.success('User created Successfully');
              resolve(true);
            } else {
              this.notificationService.error(data.description || 'Failed to create user')
            }


          }
        },
        error: (err) => {
        },
      });
    })
  }

  usersExist(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      subscriber.next(true);
      // this.angularFirestore.collection('users', ref => ref.limit(2)).valueChanges().pipe(take(1)).subscribe({
      //   next: (data) => {

      //     if (data.length) {

      //       subscriber.next(true);
      //     } else {
      //       subscriber.next(false);
      //     }
      //   },
      //   error: (err) => {
      //   },
      // });
    })
  }

  updateUser(userId: number|null, updatedUser: Partial<UserInterface>): Observable<any> {
    return this.httpClient.put(`${environment.apiRootUrl}/users/${userId}`, updatedUser);
  }
  
}
