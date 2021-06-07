import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/notification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../../../services/cliente/cliente.service';
import { Cliente } from '../../../../models/cliente';
import { Router, ActivatedRoute } from '@angular/router';
import { EnsayoService } from '../../../../services/ensayo/ensayo.service';
import { AuthenticationService } from '../../../../shared/authentication';
import { InvitacionService } from '../../../../services/invitacion/invitacion.service';

@Component({
  selector: 'app-basic-reg',
  templateUrl: './basic-reg.component.html',
  styleUrls: ['./basic-reg.component.scss']
})
export class BasicRegComponent implements OnInit {
  item: any;
  form: any;
  public options: any = { position: ['bottom', 'right'], };
  titulo: string;
  invite: any;
  idinvite: string;
  terminos: any;
  platTecnica: boolean;
  constructor(private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private itemService: ClienteService,
    private authService: AuthenticationService,
    private router: Router,
    private ensayoservice: EnsayoService,
    private route: ActivatedRoute,
    private invitacionService: InvitacionService
  ) {

    this.options = notificationService.options;
  }

  ngOnInit() {
    this.item = new Cliente();
    this.form = this.formBuilder.group({
      nombre: [null, Validators.required],
      telefono: [null],
      nombre_contacto: [null, Validators.required],
      email_contacto: [null, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      terminos: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
    this.idinvite = this.route.snapshot.queryParamMap.get('invite');
    if (this.idinvite != undefined) {
      this.titulo = "Regístrate rapido y facil";
      this.getinvite();
    } else {
      this.titulo = "Regístrate como laboratorio";
    }
  }
  public getinvite() {
    this.invitacionService.getById(this.idinvite).subscribe((value) => {
      this.invite = value.invitaciones;
      this.item.email_contacto = this.invite.email;
      this.item.invite = this.invite.tercero;
      if (this.invite.tipo == 1) {
        this.titulo = "Regístrate rapido y facil";

      } else {
        this.titulo = "Regístrate como laboratorio";
      }
    },
      (err) => {

        this.notificationService.addNotify({ title: 'Alerta', msg: err.message, type: 'error' });
      });
  }

  public registrar() {
    console.log(this.form);
    if (this.invite != undefined) {
      this.item.tipo = this.invite.tipo;
    }else{
      this.item.tipo=2;
    }
    this.item.plataformaTecnica = false;
    this.item.cuentaActiva = false;
    this.item.plataformaAdmin = false;
    this.item.admin = true;
    this.item.plataformaTecnica=false;
    this.item.inicial=true;
    this.authService.registrar(this.item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Laboratorio registrado con exito', type: 'success' });
      if (this.invite != undefined) {
        this.invite.cliente = value.user.tercero;
        this.invite.aprobado = true;
        this.actualizarInvite();
      } else {
        setTimeout(() => {
          this.router.navigateByUrl('/auth/login/simple');
        },
          1000);
      }
    }, (err) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: err.message, type: 'error' });
    });
  }
  actualizarInvite() {

    this.invitacionService.update(this.invite).subscribe((value) => {
      setTimeout(() => {
        this.router.navigateByUrl('/auth/login/simple');
      },
        1000);

    },
      (err) => {

        this.notificationService.addNotify({ title: 'Alerta', msg: err.message, type: 'error' });
      });
  }
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

}
