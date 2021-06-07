import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CondicionesAmbientalesService } from '../../../services/condiciones-ambientales/condiciones-ambientales.service';
import { CondicionesAmbientales, CondicionEdit } from '../../../models/condiciones_ambientales';

import { ParametroService } from '../../../services/parametro/parametro.service';
import { NotificationService } from '../../../shared/notification/notification.service';
import swal from 'sweetalert2';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
import {IOption} from 'ng-select';
@Component({
  selector: 'app-condiciones-ambientales',
  templateUrl: './condiciones-ambientales.component.html',
  styleUrls: ['./condiciones-ambientales.component.scss',
  '../../../../assets/icon/icofont/css/icofont.scss']
})
export class CondicionesAmbientalesComponent implements OnInit {

  formCondicionesAmbientales: FormGroup;
  condicionesAmbientalesListado: CondicionesAmbientales;
  parametrosList: Array<IOption> = [];
  user: any;
  cantidadListado = 0;
  estado = false;
  continue = true;
  edit = false;
  condicion: CondicionEdit;
  columns;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  constructor(
    private notificationService: NotificationService,
    private condicionesAmbientales: CondicionesAmbientalesService,
    private parametros: ParametroService,
    private formBuilder: FormBuilder,
    private rolesPermisosServices: RolesPermisosService
    ) {
      this.Permisos = new Permisos();
      this.columns = [
        { name: 'Nombre', prop: 'Nombre' },
        { name: 'Estado', prop: 'Estado' },
        { name: 'último ingreso', prop: 'último ingreso' },
        { name: 'Unidad', prop: 'Unidad' },
        { name: 'Límite Superior', prop: 'Límite Superior' },
        { name: 'Límite Inferior', prop: 'Límite Inferior' },
        { name: 'Opciones', prop: 'Opciones' }
      ];
    }

  ngOnInit() {
    this.condicion = new CondicionEdit();
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.condiciones[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
    this.cargarFormularios();
    this.cargarCondicionesAmbientales(this.cantidadListado);
    this.cargarParametros();
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.condiciones[0];
          console.log(this.permisosLocal);
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  /**
   * Funciones globales de la app
   */
  openModal(element) {
    document.querySelector('#' + element).classList.add('md-show');
  }
  closeModal(element) {
    document.querySelector('#' + element).classList.remove('md-show');
  }
  cargarFormularios() {
    this.formCondicionesAmbientales = new FormGroup({
      name: new FormControl(null, Validators.required),
      metodos_de_ensayo: new FormControl(null, Validators.required),
      unidad: new FormControl(null, Validators.required),
      limite_superior: new FormControl(null, Validators.required),
      limite_inferior: new FormControl(null, Validators.required)
    });
  }
 
  /**
   * Cargar Condiciones ambientales
   */

   cargarCondicionesAmbientales(desde) {
     console.log(desde)
    this.cantidadListado = desde;
    if(desde < 0) {
      this.cantidadListado = 0;
    }
    if (this.cantidadListado !== 0) {
      this.estado = true;
    }
     this.condicionesAmbientales.getAllCondicionesAmbientales(this.cantidadListado)
     .subscribe( condiciones => {
       console.log(condiciones)
       this.condicionesAmbientalesListado = condiciones['condiciones'];
      });
   }
   editar(row) {
     const condition = {
      name : row.name,
      unidad : row.unidad,
      limite_superior : row.limite_superior,
      limite_inferior : row.limite_inferior
     }
    this.condicionesAmbientales.updateCondicionesAmbientales(row._id,condition).subscribe(element => {

      this.cargarCondicionesAmbientales(this.cantidadListado);
    })
   }
   /**
    * Cargar Métodos de ensayo
    */
  cargarParametros(){
    const params = Array();
    this.parametros.get(1).subscribe(parametros => {
      parametros['parametros'].forEach( element => {
        params.push({value: element._id, label: element.nombre});
      });
      this.parametrosList = params;
      console.log(this.parametrosList)
    });
  }
  /**
   * Guardado de formulario
   */

  guardarForm() {
    if(!this.formCondicionesAmbientales.valid){
      return this.notificationService.addNotify(
        { title: 'Ingresar nuevo registro de condiciones ambientales',
          msg:  'Todos los campos son requeridos',
          type: 'error'
        }
      );
    }
if(this.formCondicionesAmbientales.value.limite_inferior > this.formCondicionesAmbientales.value.limite_superior) {
  alert('El límite inferior no debe ser mayor al límite superior');
  return this.notificationService.addNotify(
    { title: 'Ingresar nuevo registro de condiciones ambientales',
      msg:  'El límite inferior no debe ser mayor al límite superior',
      type: 'error'
    }
  );
}
    const condicionAmbiental = {
      name: this.formCondicionesAmbientales.value.name,
      unidad: this.formCondicionesAmbientales.value.unidad,
      limite_superior: this.formCondicionesAmbientales.value.limite_superior,
      limite_inferior: this.formCondicionesAmbientales.value.limite_inferior,
      tercero: this.user.tercero._id,
      usuario: this.user._id
    };

     this.condicionesAmbientales.addCondicionesAmbientales(condicionAmbiental).subscribe( condicionCreada => {
        this.formCondicionesAmbientales.value.metodos_de_ensayo.forEach( (valor) => {
          this.condicionesAmbientales.addMethodosdeEnsayo({name: valor, id_condicionesAmbientales: condicionCreada['condicio']._id})
          .subscribe(methodo => {});
        });
          location.reload();
        });

  }
  delete(condicion) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar el parametro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.condicionesAmbientales.deleteCondicionesAmbientales(condicion).subscribe(condicion => {
          this.cargarCondicionesAmbientales(this.cantidadListado);
          return this.notificationService.addNotify(
            { title: 'Condiciones Ambientales',
              msg:  `${condicion['message']}`,
              type: 'success'
            }
          );
        }); 
      }
    );
    
  }
  buscarCondiciones(event) {
    this.condicionesAmbientales.getBuscarcondiciones(event.target.value).subscribe(respuesta => {
      if(respuesta.success) {
        this.condicionesAmbientalesListado = respuesta.condiciones;
      }
    })
  }
}
