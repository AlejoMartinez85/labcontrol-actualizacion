import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Permisos, Rol } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
import { NotificationService } from '../../../shared/notification';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss']
})
export class RolComponent implements OnInit {

  $identificador: string;
  Roles: Rol;
  Permisos: Permisos;
  formaPermisos: FormGroup;
  preloader: boolean;
  user: any;
  constructor(private router: ActivatedRoute,
    private notificationService: NotificationService,
    private userService: UsuariosService,
    private rolesPermisosServices: RolesPermisosService) {
    this.preloader = true;
    this.$identificador = this.router.snapshot.paramMap.get('id');
    this.Roles = new Rol();
    this.Permisos = new Permisos();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.cargarPermisos(this.$identificador);
    this.initForms();
  }
  llenadoForm(campos): void {
    try {
      this.formaPermisos.setValue({
        agrupacion_editar : campos.Agrupacion[0].editar,
        agrupacion_eliminar: campos.Agrupacion[0].eliminar,
        agrupacion_crear: campos.Agrupacion[0].crear,
        agrupacion_ver: campos.Agrupacion[0].ver,
        ensayos_editar: campos.Ensayos[0].editar,
        ensayos_eliminar: campos.Ensayos[0].eliminar,
        ensayos_crear: campos.Ensayos[0].crear,
        ensayos_ver: campos.Ensayos[0].ver,
        cartas_editar: campos.Cartas[0].editar,
        cartas_eliminar: campos.Cartas[0].eliminar,
        cartas_crear: campos.Cartas[0].crear,
        cartas_ver: campos.Cartas[0].ver,
        datos_editar: campos.Datos[0].editar,
        datos_eliminar: campos.Datos[0].eliminar,
        datos_crear: campos.Datos[0].crear,
        datos_ver: campos.Datos[0].ver,
        deriva_editar: campos.Deriva[0].editar,
        deriva_eliminar: campos.Deriva[0].eliminar,
        deriva_crear: campos.Deriva[0].crear,
        deriva_ver: campos.Deriva[0].ver,
        equipos_editar: campos.Equipos[0].editar,
        equipos_eliminar: campos.Equipos[0].eliminar,
        equipos_crear: campos.Equipos[0].crear,
        equipos_ver: campos.Equipos[0].ver,
        parametros_editar: campos.Paramertros[0].editar,
        parametros_eliminar: campos.Paramertros[0].eliminar,
        parametros_crear: campos.Paramertros[0].crear,
        parametros_ver: campos.Paramertros[0].ver,
        clientes_editar: campos.clientes[0].editar,
        clientes_eliminar: campos.clientes[0].eliminar,
        clientes_crear: campos.clientes[0].crear,
        clientes_ver: campos.clientes[0].ver,
        condiciones_editar: campos.condiciones[0].editar,
        condiciones_eliminar: campos.condiciones[0].eliminar,
        condiciones_crear: campos.condiciones[0].crear,
        condiciones_ver: campos.condiciones[0].ver,
        configReporte_editar: campos.configReportes[0].editar,
        configReporte_eliminar: campos.configReportes[0].eliminar,
        configReporte_crear: campos.configReportes[0].crear,
        configReporte_ver: campos.configReportes[0].ver,
        muestras_editar: campos.muestras[0].editar,
        muestras_eliminar: campos.muestras[0].eliminar,
        muestras_crear: campos.muestras[0].crear,
        muestras_ver: campos.muestras[0].ver,
        usuarios_editar: campos.usuarios[0].editar,
        usuarios_eliminar: campos.usuarios[0].eliminar,
        usuarios_crear: campos.usuarios[0].crear,
        usuarios_ver: campos.usuarios[0].ver,
        validacion_editar: campos.validacion[0].editar,
        validacion_eliminar: campos.validacion[0].eliminar,
        validacion_crear: campos.validacion[0].crear,
        validacion_ver: campos.validacion[0].ver,
        incertidumbre_editar: campos.incertidumbre[0].editar,
        incertidumbre_eliminar: campos.incertidumbre[0].eliminar,
        incertidumbre_crear: campos.incertidumbre[0].crear,
        incertidumbre_ver: campos.incertidumbre[0].ver,
        _id: campos._id,
        id_role: campos.id_role,
        __v: campos.__v,
      });
      this.preloader = false;
    } catch (e) {
      this.notificaciones(e.message, 'Formulario', 'error');
    }
  }
  initForms() {
    try {
      this.formaPermisos = new FormGroup({
        agrupacion_editar : new FormControl(false, Validators.required),
        agrupacion_eliminar: new FormControl(false, Validators.required),
        agrupacion_crear: new FormControl(false, Validators.required),
        agrupacion_ver: new FormControl(false, Validators.required),
        ensayos_editar: new FormControl(false, Validators.required),
        ensayos_eliminar: new FormControl(false, Validators.required),
        ensayos_crear: new FormControl(false, Validators.required),
        ensayos_ver: new FormControl(false, Validators.required),
        cartas_editar: new FormControl(false, Validators.required),
        cartas_eliminar: new FormControl(false, Validators.required),
        cartas_crear: new FormControl(false, Validators.required),
        cartas_ver: new FormControl(false, Validators.required),
        datos_editar: new FormControl(false, Validators.required),
        datos_eliminar: new FormControl(false, Validators.required),
        datos_crear: new FormControl(false, Validators.required),
        datos_ver: new FormControl(false, Validators.required),
        deriva_editar: new FormControl(false, Validators.required),
        deriva_eliminar: new FormControl(false, Validators.required),
        deriva_crear: new FormControl(false, Validators.required),
        deriva_ver: new FormControl(false, Validators.required),
        equipos_editar: new FormControl(false, Validators.required),
        equipos_eliminar: new FormControl(false, Validators.required),
        equipos_crear: new FormControl(false, Validators.required),
        equipos_ver: new FormControl(false, Validators.required),
        parametros_editar: new FormControl(false, Validators.required),
        parametros_eliminar: new FormControl(false, Validators.required),
        parametros_crear: new FormControl(false, Validators.required),
        parametros_ver: new FormControl(false, Validators.required),
        clientes_editar: new FormControl(false, Validators.required),
        clientes_eliminar: new FormControl(false, Validators.required),
        clientes_crear: new FormControl(false, Validators.required),
        clientes_ver: new FormControl(false, Validators.required),
        condiciones_editar: new FormControl(false, Validators.required),
        condiciones_eliminar: new FormControl(false, Validators.required),
        condiciones_crear: new FormControl(false, Validators.required),
        condiciones_ver: new FormControl(false, Validators.required),
        configReporte_editar: new FormControl(false, Validators.required),
        configReporte_eliminar: new FormControl(false, Validators.required),
        configReporte_crear: new FormControl(false, Validators.required),
        configReporte_ver: new FormControl(false, Validators.required),
        muestras_editar: new FormControl(false, Validators.required),
        muestras_eliminar: new FormControl(false, Validators.required),
        muestras_crear: new FormControl(false, Validators.required),
        muestras_ver: new FormControl(false, Validators.required),
        usuarios_editar: new FormControl(false, Validators.required),
        usuarios_eliminar: new FormControl(false, Validators.required),
        usuarios_crear: new FormControl(false, Validators.required),
        usuarios_ver: new FormControl(false, Validators.required),
        validacion_editar: new FormControl(false, Validators.required),
        validacion_eliminar: new FormControl(false, Validators.required),
        validacion_crear: new FormControl(false, Validators.required),
        validacion_ver: new FormControl(false, Validators.required),
        incertidumbre_editar: new FormControl(false, Validators.required),
        incertidumbre_eliminar: new FormControl(false, Validators.required),
        incertidumbre_crear: new FormControl(false, Validators.required),
        incertidumbre_ver: new FormControl(false, Validators.required),
        _id: new FormControl('', Validators.required),
        id_role: new FormControl('', Validators.required),
        __v: new FormControl('', Validators.required),
      });
    } catch (e) {
      this.notificaciones(e.message, 'Formulario', 'error');
    }
  }
  allTrue(): void{
    try {
      this.formaPermisos.value.agrupacion_editar = true;
      this.formaPermisos.value.agrupacion_eliminar = true;
      this.formaPermisos.value.agrupacion_crear = true;
      this.formaPermisos.value.agrupacion_ver = true;
      this.formaPermisos.value.ensayos_editar = true;
      this.formaPermisos.value.ensayos_eliminar = true;
      this.formaPermisos.value.ensayos_crear = true;
      this.formaPermisos.value.ensayos_ver = true;
      this.formaPermisos.value.parametros_editar = true;
      this.formaPermisos.value.parametros_eliminar = true;
      this.formaPermisos.value.parametros_crear = true;
      this.formaPermisos.value.parametros_ver = true;
      this.formaPermisos.value.muestras_editar = true;
      this.formaPermisos.value.muestras_eliminar = true;
      this.formaPermisos.value.muestras_crear = true;
      this.formaPermisos.value.muestras_ver = true;
      this.formaPermisos.value.usuarios_editar = true;
      this.formaPermisos.value.usuarios_eliminar = true;
      this.formaPermisos.value.usuarios_crear = true;
      this.formaPermisos.value.usuarios_ver = true;
      this.formaPermisos.value.validacion_editar = true;
      this.formaPermisos.value.validacion_eliminar = true;
      this.formaPermisos.value.validacion_crear = true;
      this.formaPermisos.value.validacion_ver = true;
      this.formaPermisos.value.equipos_editar = true;
      this.formaPermisos.value.equipos_eliminar = true;
      this.formaPermisos.value.equipos_crear = true;
      this.formaPermisos.value.equipos_ver = true;
      this.formaPermisos.value.datos_editar = true;
      this.formaPermisos.value.datos_eliminar = true;
      this.formaPermisos.value.datos_crear = true;
      this.formaPermisos.value.datos_ver = true;
      this.formaPermisos.value.cartas_editar = true;
      this.formaPermisos.value.cartas_eliminar = true;
      this.formaPermisos.value.cartas_crear = true;
      this.formaPermisos.value.cartas_ver = true;
      this.formaPermisos.value.deriva_editar = true;
      this.formaPermisos.value.deriva_eliminar = true;
      this.formaPermisos.value.deriva_crear = true;
      this.formaPermisos.value.deriva_ver = true;
      this.formaPermisos.value.clientes_editar = true;
      this.formaPermisos.value.clientes_eliminar = true;
      this.formaPermisos.value.clientes_crear = true;
      this.formaPermisos.value.clientes_ver = true;
      this.formaPermisos.value.configReporte_editar = true;
      this.formaPermisos.value.configReporte_eliminar = true;
      this.formaPermisos.value.configReporte_crear = true;
      this.formaPermisos.value.configReporte_ver = true;
      this.formaPermisos.value.condiciones_editar = true;
      this.formaPermisos.value.condiciones_eliminar = true;
      this.formaPermisos.value.condiciones_crear = true;
      this.formaPermisos.value.condiciones_ver = true;
      this.formaPermisos.value.incertidumbre_editar = true;
      this.formaPermisos.value.incertidumbre_eliminar = true;
      this.formaPermisos.value.incertidumbre_crear = true;
      this.formaPermisos.value.incertidumbre_ver = true;
      this.editar();
    } catch (e) {
      this.notificaciones(e.message, 'Permisos', 'error');
    }
  }
  editar(): void {
    try {
      this.preloader = true;
      let Permisos = {};
      Permisos['Agrupacion'] = {
        'editar': this.formaPermisos.value.agrupacion_editar,
        'eliminar': this.formaPermisos.value.agrupacion_eliminar,
        'crear': this.formaPermisos.value.agrupacion_crear,
        'ver': this.formaPermisos.value.agrupacion_ver,
      };
      Permisos['Ensayos'] = {
        'editar': this.formaPermisos.value.ensayos_editar,
        'eliminar': this.formaPermisos.value.ensayos_eliminar,
        'crear': this.formaPermisos.value.ensayos_crear,
        'ver': this.formaPermisos.value.ensayos_ver,
      };
      Permisos['Paramertros'] = {
        'editar': this.formaPermisos.value.parametros_editar,
        'eliminar': this.formaPermisos.value.parametros_eliminar,
        'crear': this.formaPermisos.value.parametros_crear,
        'ver': this.formaPermisos.value.parametros_ver,
      };
      Permisos['muestras'] = {
        'editar': this.formaPermisos.value.muestras_editar,
        'eliminar': this.formaPermisos.value.muestras_eliminar,
        'crear': this.formaPermisos.value.muestras_crear,
        'ver': this.formaPermisos.value.muestras_ver,
      };
      Permisos['usuarios'] = {
        'editar': this.formaPermisos.value.usuarios_editar,
        'eliminar': this.formaPermisos.value.usuarios_eliminar,
        'crear': this.formaPermisos.value.usuarios_crear,
        'ver': this.formaPermisos.value.usuarios_ver,
      };
      Permisos['validacion'] = {
        'editar': this.formaPermisos.value.validacion_editar,
        'eliminar': this.formaPermisos.value.validacion_eliminar,
        'crear': this.formaPermisos.value.validacion_crear,
        'ver': this.formaPermisos.value.validacion_ver,
      };
      Permisos['Equipos'] = {
        'editar': this.formaPermisos.value.equipos_editar,
        'eliminar': this.formaPermisos.value.equipos_eliminar,
        'crear': this.formaPermisos.value.equipos_crear,
        'ver': this.formaPermisos.value.equipos_ver,
      };
      Permisos['Datos'] = {
        'editar': this.formaPermisos.value.datos_editar,
        'eliminar': this.formaPermisos.value.datos_eliminar,
        'crear': this.formaPermisos.value.datos_crear,
        'ver': this.formaPermisos.value.datos_ver,
      };
      Permisos['Cartas'] = {
        'editar': this.formaPermisos.value.cartas_editar,
        'eliminar': this.formaPermisos.value.cartas_eliminar,
        'crear': this.formaPermisos.value.cartas_crear,
        'ver': this.formaPermisos.value.cartas_ver,
      };
      Permisos['Deriva'] = {
        'editar': this.formaPermisos.value.deriva_editar,
        'eliminar': this.formaPermisos.value.deriva_eliminar,
        'crear': this.formaPermisos.value.deriva_crear,
        'ver': this.formaPermisos.value.deriva_ver,
      };
      Permisos['clientes'] = {
        'editar': this.formaPermisos.value.clientes_editar,
        'eliminar': this.formaPermisos.value.clientes_eliminar,
        'crear': this.formaPermisos.value.clientes_crear,
        'ver': this.formaPermisos.value.clientes_ver,
      };
      Permisos['configReportes'] = {
        'editar': this.formaPermisos.value.configReporte_editar,
        'eliminar': this.formaPermisos.value.configReporte_eliminar,
        'crear': this.formaPermisos.value.configReporte_crear,
        'ver': this.formaPermisos.value.configReporte_ver,
      };
      Permisos['condiciones'] = {
        'editar': this.formaPermisos.value.condiciones_editar,
        'eliminar': this.formaPermisos.value.condiciones_eliminar,
        'crear': this.formaPermisos.value.condiciones_crear,
        'ver': this.formaPermisos.value.condiciones_ver,
      };
      Permisos['incertidumbre'] = {
        'editar': this.formaPermisos.value.incertidumbre_editar,
        'eliminar': this.formaPermisos.value.incertidumbre_eliminar,
        'crear': this.formaPermisos.value.incertidumbre_crear,
        'ver': this.formaPermisos.value.incertidumbre_ver,
      };
      Permisos['_id'] = this.formaPermisos.value._id;
      Permisos['id_role'] = this.formaPermisos.value.id_role;
      Permisos['__v'] = this.formaPermisos.value.__v;
      this.rolesPermisosServices.editPermisos( Permisos ).subscribe( (resp: any) => {
        if (resp.success) {
          document.getElementById('atras').click();
        } else {
          this.notificaciones(resp.message, 'Permisos', 'error');
        }
      });
    } catch (e) {
      this.notificaciones(e.message, 'Permisos', 'error');
    }
  }
  Retablecer(): void {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar el Rol?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true
    }).then((result) => {
      if (result) {
        this.preloader = true;
        try {
          this.rolesPermisosServices.deletePermisos(this.Permisos._id).subscribe( (resp: any) => {
            if (resp.success) {
              this.notificaciones(resp.message, 'Permisos', 'success');
              if ( localStorage.getItem('permisos')) {
                localStorage.removeItem('permisos')
              }
              this.cargarPermisos(this.$identificador);
            } else {
              this.notificaciones(resp.message, 'Permisos', 'error');
            }
          });
        } catch (e) {
          this.notificaciones(e.message, 'Permisos', 'error');
        }
      }
    });
  }
  cargarPermisos(id: string): void {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {
        if (resp.success) {
          this.Permisos = new Permisos();
          localStorage.setItem('permisos', JSON.stringify(resp.permisos))
          this.Permisos = JSON.parse(localStorage.getItem('permisos'));
          console.log(this.Permisos);
          this.notificaciones(resp.message, 'Permisos', 'success');
          this.llenadoForm(this.Permisos);
        } else {
          this.notificaciones(resp.message, 'Permisos', 'error');
        }
      });
    } catch (e) {
      this.notificaciones(e.message, 'Permisos', 'error');
    }
  }

   /**
   * Notificaciones
   * @param msn String
   * @param titulo String
   * @param tipo String
   */
  notificaciones(msn: string, titulo: string, tipo: string) {
    return this.notificationService.addNotify(
      {
        title: titulo,
        msg: msn,
        type: tipo
      }
    );
  }

}
