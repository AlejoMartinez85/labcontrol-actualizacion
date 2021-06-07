import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../shared/authentication';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/notification';
import { EnsayoService } from '../../../../services/ensayo/ensayo.service';

@Component({
  selector: 'app-basic-login',
  templateUrl: './basic-login.component.html',
  styleUrls: ['./basic-login.component.scss']
})
export class BasicLoginComponent implements OnInit {

  loginData = { username: '', password: '' };
  message = '';
  errMsgArr = [];
  public options: any = { position: ['bottom', 'right'], };
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService,
    private ensayoservice: EnsayoService
  ) {
    this.options = notificationService.options;
  }

  ngOnInit() {

  }
  public login() {

    this.authService.login(this.loginData).subscribe((value) => {
      console.log(value)
      localStorage.setItem('userInfo', JSON.stringify(value));
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Bienvenido ' + value.name, type: 'success' });
      setTimeout(() => {
        this.router.navigateByUrl('/');
      },
        1000);

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Usuario o contraseña incorrecta ', type: 'error' });
    });
  }

}
