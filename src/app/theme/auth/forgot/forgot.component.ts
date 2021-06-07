import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { NotificationService } from '../../../shared/notification';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  form: FormGroup;
  email: any;
  public options: any = { position: ['bottom', 'right'], };
  myForm: FormGroup;
  newpassword: string;
  rpassword: string;
  formSubmit = false;
  perdirPassword = false;
  token: string;
  usuario: any;
  isValidFormSubmitted: boolean;
  constructor(private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsuariosService, ) {

    this.options = notificationService.options;

  }


  ngOnInit() {
    const password = new FormControl('', Validators.required);
    const rpassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);
    const email = new FormControl('', [Validators.required]);
    this.myForm = new FormGroup({
      password: password,
      rpassword: rpassword,
      email: email
    });
    this.form = this.formBuilder.group({
      email: [null, Validators.required],
    });
    this.validartoken();
  }
  validartoken() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token == undefined) {
      this.perdirPassword = false;
    } else {
      this.perdirPassword = true;

    }
  }
  enviarrecordar() {
    this.formSubmit = true;
    if (!this.form.valid) {
      return false;
    }
    this.formSubmit = false;

    this.clienteService.remember({ email: this.email }).subscribe((value) => {

      this.notificationService.addNotify({ title: 'Alerta', msg: 'Solicitud enviada con exito', type: 'success' });
      setTimeout(() => {
        this.router.navigateByUrl('/');
      },
        1000);

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargardatos($event) {
    //this.email = $event.target.value;
    this.userService.getBytoken(this.token, this.email).subscribe((value) => {
      this.usuario = value.user;
      if (this.usuario == undefined) {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      }

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  actualizarItem() {

    this.userService.acttoken(this.usuario).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Contraseña actualizada con exito', type: 'success' });
      setTimeout(() => {
        this.router.navigateByUrl('/');
      },
        1000);

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }
  cambiarpassword() {
    this.isValidFormSubmitted = false;
    if (this.myForm.invalid) {
      return;
    }
    this.isValidFormSubmitted = true;
    this.usuario.password = this.newpassword;
    this.usuario.cambiopassword = true;
    this.usuario.token = this.token;
    this.actualizarItem();
  }

}
