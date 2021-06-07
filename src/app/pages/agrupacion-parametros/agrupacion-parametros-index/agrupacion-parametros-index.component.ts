import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { animate, style, transition, trigger } from '@angular/animations';
import swal from 'sweetalert2';
import { AgrupacionParametrosService } from '../../../services/agrupacion-parametros/agrupacion-parametros.service';
import { AgrupacionParametro } from '../../../models/agrupacion_parametro';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';

@Component({
  selector: 'app-agrupacion-parametros-index',
  templateUrl: './agrupacion-parametros-index.component.html',
  styleUrls: ['./agrupacion-parametros-index.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AgrupacionParametrosIndexComponent implements OnInit {

  form: FormGroup;
  item: any;
  items: any;
  columns: any[];
  user: any;
  parametros: any[];
  parametronew: any;
  @ViewChild('myTable') table: any;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  constructor(private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private parametroService: AgrupacionParametrosService,
    private _parametroService: ParametroService,
    private rolesPermisosServices: RolesPermisosService) {
    this.columns = [{ name: 'Nombre' },
    { name: 'Metodo', prop: 'tecnica_analitica' },
    { name: 'Tecnica analítica', prop: 'tecnica_analitica' },
    { name: 'Unidad', prop: 'unidad' },
    { name: 'valor_unit', prop: 'valor_unit' },
    { name: 'descripcion', prop: 'descripcion' }];
    this.cargardatos();
    this.cargarParametros();
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.Permisos = new Permisos();
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.Agrupacion[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
  }

  ngOnInit() {
    this.item = new AgrupacionParametro();
    this.form = this.formBuilder.group({
      nombre: [null, Validators.required],
      codigo: [null, Validators.required]
    });

  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe((resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.Agrupacion[0];
          console.log(this.Permisos)
          console.log(this.permisosLocal)
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  openMyModal(event) {
    this.cargarParametros();
    this.item.parametros = [];
    document.querySelector('#' + event).classList.add('md-show');
  }
  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  closeMyModalbtn(event) {
    ((event.target.parentElement.parentElement.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  guardar(event) {

    this.item.tercero = this.user.tercero._id;
    this.parametroService.add(this.item).subscribe((value) => {

      this.closeMyModalbtn(event);
      this.cargardatos();
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Agrupación de Parametro almacenado con exito', type: 'success' });
      this.form.reset();
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargardatos() {
    this.parametroService.get(1).subscribe((value) => {

      this.items = value.parametros;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  celiminarItem(item) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar la agrupación?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

      this.eliminarItem(item);
    }
    );
  }
  eliminarItem(item) {
    this.parametroService.delete(item._id, item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Agrupación de Parametro eliminado con exito', type: 'success' });
      item.edit = false;
      let index = this.items.indexOf(item);
      this.items.splice(index, 1);
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  celiminarItemParametro(item, row) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar el parametro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {
      let index = item.parametros.indexOf(row);
      item.parametros.splice(index, 1);
    }
    );
  }
  cactualizarItem(item) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas actualizar la agrupación de parametros?',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {
      this.actualizarItem(item);
    }
    );
  }
  actualizarItem(item) {

    this.parametroService.update(item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Agrupación de Parametro actualizado con exito', type: 'success' });
      item.edit = false;
      location.reload();
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }
  cargarParametros() {
    this._parametroService.get(1).subscribe((value) => {
      this.parametros = [];
      for (let i = 0; i < value.parametros.length; i++) {
        let parametro = value.parametros[i];
        this.parametros.push({ value: parametro._id, label: parametro.nombre + ' (' + parametro.codigo + ')', disabled: false });


      }

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  agregarParametro(item) {
    if (item.parametros == undefined) {
      item.parametros = [];
    }
    this._parametroService.getById(this.parametronew).subscribe((value) => {

      item.parametros.push(value.parametros);

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });

  }
  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

}
