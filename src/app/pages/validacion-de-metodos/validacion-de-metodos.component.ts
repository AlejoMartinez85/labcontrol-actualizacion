import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators   } from '@angular/forms';
import { ValidacionMetodosConfigService } from '../../services/validacion-demetodos/validacion-metodos-config.service';
import { NotificationService } from '../../shared/notification';
import swal from 'sweetalert2';
import { Permisos } from '../../models/Rol';
import { RolesPermisosService } from '../../services/roles/roles-permisos.service';

@Component({
  selector: 'app-validacion-de-metodos',
  templateUrl: './validacion-de-metodos.component.html',
  styleUrls: ['./validacion-de-metodos.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss']
})
export class ValidacionDeMetodosComponent implements OnInit {
  formaBancoDeMuestras: FormGroup;
  public preloader: boolean = true;
  Validaciones: any;
  user: any;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  constructor(
    private notificationService: NotificationService,
    private ValidacionMetodoService: ValidacionMetodosConfigService,
    private rolesPermisosServices: RolesPermisosService) {
    this.Permisos = new Permisos();
    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    this.initForms();
    this.cargarValidaciones();
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.validacion[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe((resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.validacion[0];
          console.log(this.permisosLocal);
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  initForms(): void {
    this.formaBancoDeMuestras = new FormGroup({
      nombre: new FormControl('Validación Data', Validators.required),
      Linealidad: new FormControl(false),
      Sensibilidad: new FormControl(false),
      Limite_de_deteccion: new FormControl(false),
      Limite_de_cuantificacion: new FormControl(false),
      Exactitud: new FormControl(false),
      Precision_Repetibi: new FormControl(false),
      Precision_Reproduc: new FormControl(false),
      Recuperacon_en_matriz: new FormControl(false),
      Intervalo_de_trabaj: new FormControl(false),
      Robustez: new FormControl(false),
      Banco_muestras: new FormControl(false),
    });
  }
  openMyModal(event): void {
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event): void {
    document.querySelector('#' + event).classList.remove('md-show');
  }
  cargarValidaciones(): void {
    this.ValidacionMetodoService.get().subscribe((resp: any) => {
      if (resp.success) {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Listado de Validaciones', type: 'success' });
        this.Validaciones = resp.validaciones;
        this.preloader = false;
      } else {
        if (resp.cantidad == 0) {
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
          this.openMyModal('Validacion-de-muestras');
          this.preloader = false;
        }
        this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
      }
    })
  }
  selectAll(select): void {
    console.log(select);
    // this.formaBancoDeMuestras.setValue({
    //   Linealidad: true,
    //   Sensibilidad: true,
    //   Limite_de_deteccion: true,
    //   Limite_de_cuantificacion: true,
    //   Exactitud: true,
    //   Precision_Repetibi: true,
    //   Precision_Reproduc: true,
    //   Recuperacon_en_matriz: true,
    //   Intervalo_de_trabaj: true,
    //   Robustez: true,
    // });
  }
  calcularForm(): void {
    this.preloader = true;
    if (this.formaBancoDeMuestras.valid) {
      const validacionCreated = {
        nombre: this.formaBancoDeMuestras.value.nombre,
        Recuperacion: this.formaBancoDeMuestras.value.Recuperacon_en_matriz,
        linealidad: this.formaBancoDeMuestras.value.Linealidad,
        sencibilidad: this.formaBancoDeMuestras.value.Sensibilidad,
        limite_deteccion: this.formaBancoDeMuestras.value.Limite_de_deteccion,
        limite_cuantificacion: this.formaBancoDeMuestras.value.Limite_de_cuantificacion,
        exactitud: this.formaBancoDeMuestras.value.Exactitud,
        presicion_repetitibilidad: this.formaBancoDeMuestras.value.Precision_Repetibi,
        presicion_producivilidad: this.formaBancoDeMuestras.value.Precision_Reproduc,
        recuperacion_matriz: this.formaBancoDeMuestras.value.Recuperacon_en_matriz,
        robustez: this.formaBancoDeMuestras.value.Robustez,
        intervalodetrabajo: this.formaBancoDeMuestras.value.Intervalo_de_trabaj,
        banco_muestras: this.formaBancoDeMuestras.value.Banco_muestras,
        tercero: this.user.tercero._id
      };
      this.ValidacionMetodoService.create(validacionCreated).subscribe((resp: any) => {
        console.log(resp)
        if (resp.success) {
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
          this.closeMyModal('Validacion-de-muestras');
          this.cargarValidaciones();
        }
      });
    } else {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'El nombre es Requerido', type: 'error' });
      this.preloader = false;
    }
  }
  eliminar(validacion: string): void {
    swal({
      title: 'Alerta!',
      text: '¿Realmente desea eliminar la Validación?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then((result) => {
      this.preloader = true;
      if (result.value) {
        this.ValidacionMetodoService.delete(validacion).subscribe((resp: any) => {
          if (resp.success) {
            this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
            this.cargarValidaciones();
          } else {
            this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'error' });
          }
        });
      } else {
        this.preloader = false;
      }
    });
  }
}
