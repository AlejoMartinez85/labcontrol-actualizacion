import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { animate, style, transition, trigger } from '@angular/animations';
import { Parametro } from '../../../models/parametro';
import swal from 'sweetalert2';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { Cliente } from '../../../models/cliente';
import { Invitacion } from '../../../models/invitacion';
import { InvitacionService } from '../../../services/invitacion/invitacion.service';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';

@Component({
  selector: 'app-clientes-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss',
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
export class IndexComponent implements OnInit {

  form: FormGroup;
  item: any;
  items: any;
  columns: any[];
  user: any;
  cliente: Cliente;
  autocompleteItems: string[];
  clienteSel: any;
  indicadores: any;
  indclientes: any;
  datoCopypaste = [];
  displayedColumns: string[];
  cabeceras = ['Email', 'Nombre'];
  btnActivo = false;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  constructor(private notificationService: NotificationService,
              private formBuilder: FormBuilder,
              private itemService: ClienteService,
              private invitacionService: InvitacionService,
              private rolesPermisosServices: RolesPermisosService) {
      this.Permisos = new Permisos();
      this.columns = [{ name: 'Nombre' },
    { name: 'Metodo', prop: 'tecnica_analitica' },
    { name: 'Tecnica analítica', prop: 'tecnica_analitica' },
    { name: 'Unidad', prop: 'unidad' },
    { name: 'valor_unit', prop: 'valor_unit' },
    { name: 'descripcion', prop: 'descripcion' }];

      this.cliente = new Cliente();

      this.user = JSON.parse(localStorage.getItem('userInfo'));
      if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.clientes[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
      this.cargardatos();
      this.getclientes();

  }

  ngOnInit() {
    this.item = new Invitacion();
    this.item.notificar = false;
    this.form = this.formBuilder.group({
      emails: [null, Validators.required],
      nombre: [null, Validators.required],
      notificar: [],
      descripcion: [],
    });

  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.clientes[0];
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
    document.querySelector('#' + event).classList.add('md-show');
  }
  closeModalMasivos(event) {
    document.querySelector('#' + event).classList.remove('md-show');
  }
  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  closeMyModalbtn(event) {
    ((event.target.parentElement.parentElement.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  guardar(event) {
    this.item.emails = [{ value: this.item.emails }];
    this.item.tipo = 1;
    this.item.tercero_id = this.cliente._id;
    this.invitacionService.add(this.item).subscribe((value: any) => {
      this.item = new Invitacion();
      this.item.notificar = true;
      this.closeModalMasivos('effect-3');
      this.cargardatos();
      if (value.nuevo) {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Cliente creado con exito', type: 'success' });
      } else {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'El cliente ya existe se ha enviado una invitación', type: 'success' });
      }

    },
      (err) => {

        this.notificationService.addNotify({ title: 'Alerta', msg: err.message, type: 'error' });
      });
  }
  cargardatos() {
    this.itemService.getById(this.user.tercero._id).subscribe((value: any) => {
      this.cliente = value.clientes;
      this.indclientes = value.indclientes;
      this.indicadores = value.indicadores;
      console.log(this.indclientes)
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  celiminarItem(item) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar el cliente?',
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

    let index = this.cliente.clientes.indexOf(item);
    this.cliente.clientes.splice(index, 1);
    console.log(index)
    console.log(item)
    console.log(this.cliente.clientes)
    this.actualizarItem(this.cliente);
    this.cargardatos()
  }
  cactualizarItem(item) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas actualizar el cliente?',
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

    this.itemService.update(item).subscribe((value) => {
      console.log(value)
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Cliente actualizado con exito', type: 'success' });
      item.edit = false;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }
  getclientes() {
    this.itemService.getOptions(1).subscribe((value: any) => {
      this.items = value.clientes;

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  clienteseleccionado(event) {
    this.item.emails = event.email_contacto;
    this.item.nombre = event.nombre;
  }
}
