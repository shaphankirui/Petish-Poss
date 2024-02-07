import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HotToastService } from '@ngneat/hot-toast';
import { landingPage } from 'src/app/Data/landing-page.data';
import { environment } from 'src/app/Environments/environment';
import { DateTimeService } from '../DateTime/date-time.service';
import { LocalStorageService } from '../LocalStorage/local-storage.service';
import { UserInterface, PasswordResetInterface, LoginInterface, UserSessionInterface, SignupInterface, SetNewPasswordInterface, PermissionInterface } from 'src/app/Interfaces/auth.interface';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  helper = new JwtHelperService();
  user$ = new BehaviorSubject<UserInterface | null>(this.localStorageService.getItem('user', true));
  passwordResetData = new BehaviorSubject<PasswordResetInterface | null>(null);
  apiUrl = environment.apiRootUrl;
  sessionHasExpired = new BehaviorSubject<boolean>(false);
  sessionTimeout$ = new BehaviorSubject<number>(Number(this.localStorageService.getItem('ETA')));
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private dateTimeService: DateTimeService,
    private toast:HotToastService
  ) { }

  AdminLogin(email: string, password: string): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
      const user: LoginInterface = { email, password };
      this.login(user).then((res) => {
        resolve(res);
      })
    })

    // return this.httpClient.post(environment.apiRootUrl, { _usernamelgd: username, _login_password: password, _org_code: 'nbdem', "_rememberme": "1" }, httpOptions);
  }
  getAllUsers(token: string,): Observable<any> {
    return this.httpClient.post(environment.apiRootUrl, { _org_code: 'nbdem', _jwttoken: token, _cloud_function_run: 'point_of_sale', _get_pos_products_list: 1 }, httpOptions)
  }
  get isLoggedIn(): boolean {
    const token = localStorage.getItem('jwttoken');
    return this.helper.isTokenExpired(token);
  }
  pinAuthentication(pin: string) {
    const errorNotification = 'Invalid Pin';

    return new Promise<boolean>((resolve, reject) => {
      // LARAVEL
      this.httpClient.post(`${this.apiUrl}/pin-authentication`, { pin }).pipe(take(1)).subscribe({
        next: (data: any) => {
          if (data) {
            const response = data as UserSessionInterface;
            this.createSession(response);
            resolve(true);
          } else {
            this.toast.error(errorNotification);
          }
        },
        error: (err) => {
          this.toast.error(errorNotification);
        },
      });
    });
  }






  login(user: LoginInterface): Promise<boolean> {
    const errorNotification = 'Wrong email or password, please try again';

    return new Promise<boolean>((resolve, reject) => {
      // LARAVEL
      this.httpClient.post(`${this.apiUrl}/login`, user).pipe(take(1)).subscribe({
        next: (data: any) => {
          if (data) {
            const response = data as UserSessionInterface;
            this.createSession(response);
            resolve(true);
          } else {
            this.toast.error(errorNotification);
          }
        },
        error: (err) => {
          this.toast.error(errorNotification);
        },
      });
    });
  }

  isLoggedInn(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user) // Converts user to boolean (true if user exists)
    );
  }

  signup(user: SignupInterface) {

  }

  resetPassword(user: { email: string, organization: string }): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const organization = user.organization;
      const email = user.email;
      this.httpClient.post(`${environment.apiRootUrl}/reset-password`, { organization: organization, email: email }).pipe(take(1)).subscribe({
        next: (data: any) => {
          if (data.message === 'Success') {
            this.toast.success('Check Your Email');
            resolve(true);
          } else {
            if (data.message) {
              this.toast.error(data.message);
            }

            resolve(false);
          }

        },
        error: (err) => {
        },
      });
    })
  }

  sendSMS() {

  }


  setNewPassword(data: SetNewPasswordInterface): Promise<{ email: string }> {
    // make an API call with this data
    return new Promise<{ email: string }>((resolve, reject) => {
      this.httpClient.post(`${environment.apiRootUrl}/set-new-password`, data).pipe(take(1)).subscribe({
        next: (data: any) => {
          console.log(data);

          if (data.message === 'Success') {
            resolve({ email: data.email });
            return;
          } else {
            this.toast.error('Password reset failed');
          }
        },
        error: (err) => {
        },
      });
    });
  }

  logout(all?: boolean) {
    this.localStorageService.clear(all);
    this.user$.pipe(take(1)).subscribe({
      next: (data) => {
        if (data) {
          window.location.reload();
        }
      }
    });
  }




  checkIfRegistered(email: string) {
  }

  getPermission(
    permissions: PermissionInterface[],
    permission: string,
    key: string,
  ): boolean {

    const filteredPermissions = permissions.filter((p) => p.permission === permission);

    let result = false;
    let permit: boolean;
    filteredPermissions.forEach((f) => {
      switch (key) {
        case 'create':
          permit = filteredPermissions.some((P) => P.create === 1);
          break;

        case 'read':
          permit = filteredPermissions.some((P) => P.read === 1);

          break;


        case 'update':
          permit = filteredPermissions.some((P) => P.update === 1);

          break;

        case 'delete':
          permit = filteredPermissions.some((P) => P.delete === 1);

          break;

        case 'admin':
          permit = filteredPermissions.some((P) => P.admin === 1);

          break;

        case 'professional':
          permit = filteredPermissions.some((P) => P.professional === 1);

          break;

        default:
          break;
      }
      if (permit) {
        result = true;
      }
    })
    if (permission === 'users') {
    }

    return result;
  }


  // SESSION
  createSession(response: UserSessionInterface, hours?: number) {
    this.user$.next(response.user);
    this.localStorageService.setLocalItem('user', response.user);
    this.localStorageService.setLocalItem('token', response.token);
    this.setTokenExpiration();
    this.toast.success('Login successfulll');
    this.router.navigate([landingPage]);
    this.checkWhetherSessionHasExpired();
    // if (hours) {
    //   const expirationTimeInMilliseconds = hours * 3600 * 1000; // Convert hours to milliseconds
    //   setTimeout(() => {
    //     this.logout();
    //     this.notificationService.showInfo('Session has expired. You have been logged out.');
    //   }, expirationTimeInMilliseconds);
    // }
  }
  
  setTokenExpiration() {
    const defaultExpiryTime = new Date().getTime() + (60 * 60 * 1000); // Default expiration time (5 minutes)
    this.localStorageService.setLocalItem('ETA', defaultExpiryTime);
  
    // Listen for user activity (example: mousemove and keydown events)
    document.addEventListener('mousemove', this.extendSession);
    document.addEventListener('keydown', this.extendSession);
  }
  
  extendSession = () => {
    const currentExpiryTime = Number(this.localStorageService.getItem('ETA'));
    const extendedExpiryTime = new Date().getTime() + (5 * 60 * 1000); // Extend by 5 minutes (adjust as needed)
  
    // Update expiration time only if the new expiration time is later than the current one
    if (extendedExpiryTime > currentExpiryTime) {
      this.localStorageService.setLocalItem('ETA', extendedExpiryTime);
      console.log('User activity detected',extendedExpiryTime);

    }
  
    // Log activity to console
  }
  


  getUser() {

    const user: any = JSON.parse(this.localStorageService.getItem('user'));

    if (user.id) {
      this.httpClient.get(`${environment.apiRootUrl}/users/find/${user.id}`).pipe(take(1)).subscribe({
        next: (data) => {

          if (data) {
            const userFromBD = data as UserInterface;

            // this.user$.next(user);
          }
        },
        error: (err) => {
        },
      });
    }
  }


  setHoursBeforeSessionExpires(expirationTime: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.localStorageService.setLocalItem('ETA', expirationTime);
      resolve(true);
    })
  }

  checkWhetherSessionHasExpired() {
    const notification = 'Session has expired, Verify your account';
    const expirationTime: any = this.localStorageService.getItem('ETA');

    if (expirationTime) {
      const expirationDate = Number(expirationTime);
      const now = Number(new Date().getTime());
      const delay = expirationDate - now;

      setTimeout(() => {
        this.toast.info(notification);
        this.sessionHasExpired.next(true);
        this.logout();
      }, delay);
    } else {
      this.sessionHasExpired.next(true);
      this.logout();
    }

  }

  userIsLoggedIn(): Observable<UserInterface | null> {
    return new Observable<UserInterface | null>((subscriber) => {
      const user = this.localStorageService.getItem('user', true);
      subscriber.next(user);
    })
  }
  getCurrentUser(): Observable<UserInterface | null> {
    return this.user$.asObservable();
  }



  requestOtp(user: UserInterface) {
    return new Promise<boolean>((resolve, reject) => {
      const request = {
        email: user.email,
        phone: user.phone.toString(),
      }
      this.httpClient.post(`${environment.apiRootUrl}/otp`, request).pipe(take(1)).subscribe({
        next: (data) => {
          resolve(true);
        },
        error: (err) => {
        },
      });
    })
  }

  verifyOTP(request: { email: string, otp: string }) {
    return new Promise<boolean>((resolve, reject) => {
      this.httpClient.post(`${environment.apiRootUrl}/otp/verify`, request).pipe(take(1)).subscribe({
        next: (data: any) => {
          console.log(data)
          if (data.value) {
            this.sessionHasExpired.next(false);
            // convert hours to miliseconds or use miliseconds till midnight
            let sessionDuration = this.dateTimeService.getMilisecondsTillMidnight();
            const hours = 48;
            if (hours) {
              const now = Number(new Date().getTime());
              sessionDuration = now + (hours * 3600 * 1000);
            }

            // set hours before session expires
            this.setHoursBeforeSessionExpires((sessionDuration)).then((res) => {
              // if (res) this.checkWhetherSessionHasExpired();his

              resolve(true);
            });
          } else {
            resolve(false);
          }
        },
        error: (err) => {
        },
      });
    })
  }


  findUserOtp(email: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.httpClient.post(`${environment.apiRootUrl}/otp/find`, { email }).pipe(take(1)).subscribe({
        next: (res) => {
          console.log(res);
        }
      })
    })
  }



  // on destroy
  destroy$ = new Subject();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
