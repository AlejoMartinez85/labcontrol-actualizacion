import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { animate, style, transition, trigger } from '@angular/animations';
import { Parametro } from '../../../models/parametro';

import swal from 'sweetalert2';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { Cliente } from '../../../models/cliente';
import { AuthenticationService } from '../../../shared/authentication';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { Usuario } from '../../../models/usuario';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
import { Permisos, Rol } from '../../../models/Rol';

@Component({
  selector: 'app-index',
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
  user: Usuario;
  esAdmin = false;
  filteredData :any;
  data :any;
  cliente: Cliente;
  usuarios: any;
  datoCopypaste = [];
  displayedColumns: string[] ;
  cabeceras = ['Nombre', 'cliente', 'emaila']
  Roles: Rol;
  Permisos: Permisos;
  catchRol: boolean;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  constructor(private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private itemService: ClienteService,
    private userService: UsuariosService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private rolesPermisosServices: RolesPermisosService ) {
    this.columns = [{ name: 'Nombre' },
    { name: 'Metodo', prop: 'tecnica_analitica' },
    { name: 'Tecnica analítica', prop: 'tecnica_analitica' },
    { name: 'Unidad', prop: 'unidad' },
    { name: 'valor_unit', prop: 'valor_unit' },
    { name: 'descripcion', prop: 'descripcion' }];
    this.catchRol = false;
    this.cliente = new Cliente();
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.cargardatos();
    this.Roles = new Rol();
    this.cargaRoles();
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.usuarios[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }

  }

  ngOnInit() {
    console.log(this.user['plataformaTecnica'])
    this.item = new Parametro();
    this.form = this.formBuilder.group({
      nombre: [null, Validators.required],
      rol: [null, Validators.required],
      last_name: [null, Validators.required],
      email: [null, Validators.required],
      analista: [null],
      infofinanciera:[null],
      recepcionM:[null],
    });
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.usuarios[0];
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
      //MEnsaje personalisado 
    }
  }
  cargaRoles() {
    this.Roles = new Rol();
    this.rolesPermisosServices.getRole().subscribe( (resp: any) => {
      if (resp.success) {
        if (resp.cantidad === 0) {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'info' });
          this.openMyModal('roles');
        } else {
          this.Roles = resp.roles;
          this.catchRol = true;
        }
      }
    });
  }
  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }
  coleModal(element) {
    document.querySelector('#' + element).classList.remove('md-show');
  }
  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  closeMyModalbtn(event) {
    ((event.target.parentElement.parentElement.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  guardarRole(nombreRol) {
    if (nombreRol.value !== '') {
      const role = {
        nombre: nombreRol.value,
        tercero: this.user.tercero._id
      };
      this.rolesPermisosServices.createRole(role).subscribe( (resp: any) => {
        if (resp.success) {
          this.cargaRoles();
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'success' });
          this.coleModal('roles');
        } else {
          return this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'success' });

        }
      });
    }
  }
  guardar(event) {

    if (this.item._id != undefined) {
      this.cactualizarItem(this.item);
    } else {
      this.item.tercero = this.user.tercero._id;
      this.item.password = this.makeid(8);
      this.item.plataformaTecnica = this.user['plataformaTecnica'];
      this.item.plataformaTecnica = this.user['plataformaTecnica'];
      this.item.cuentaActiva = this.user['cuentaActiva'];
      this.item.plataformaAdmin = this.user['plataformaAdmin'];
      this.item.admin = false;
      this.item.inicial = false;
      this.authService.registrar(this.item).subscribe((value) => {
        this.closeMyModalbtn(event);
        this.cargardatos();
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Usuario almacenado con exito', type: 'success' });
        console.log(value);
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }

  }
  cargardatos() {
    this.itemService.getById(this.user.tercero._id).subscribe((value) => {
      this.cliente = value.clientes;
      this.usuarios = this.cliente.usuarios;
      console.log(this.usuarios)
      // populate datatable rows
      this.data = this.cliente;
      // copy over dataset to empty object
      this.filteredData = this.cliente;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  celiminarItem(item) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas  eliminar este usuario?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.eliminarItem(item);
      }

    );
  }
  eliminarUsuario(id){
    console.log(this.user)
    if (id === this.user['id']) {
          return this.notificationService.addNotify({ title: 'Usuarios', msg: 'No se puede eliminar a usted mismo', type: 'error' });
    }
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas  eliminar este usuario?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {
      this.userService.borrarUser(id).subscribe((value) => {
        if (value.success) {
          console.log(value.message)
          this.notificationService.addNotify({ title: 'Alerta', msg: value.message, type: 'success' });
          this.cargardatos();
        }
      });
    });
  }
  eliminarItem(item) {
    this.userService.delete(item._id, item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'usuario eliminado con exito', type: 'success' });
      item.edit = false;
      this.cargardatos();
      
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }

  ceditarrItem(item) {
    this.item = item;
    let index = this.cliente.usuarios.indexOf(item);
    if (index == 0) {
      item.principal = true;
    } else {
      item.principal = false;
    }
    this.openMyModal('effect-3')
  }
  cactualizarItem(item) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas  actualizar este usuario?',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.actualizarItem(item);

        this.cargardatos();
      }

    );
  }
  actualizarItem(item) {

    this.userService.update(item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Usuario actualizado con exito', type: 'success' });
      item.edit = false;
      this.coleModal('effect-3');
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valida los datos ', type: 'error' });
    });


  }
  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  buscadorUsuarios(event) {
    const texto = event.target.value.toLowerCase();
    const usuarios = [];
    if(texto.length === 0) {
      this.cargardatos();
    } else {
      for (let usuario of  this.usuarios) {
        let last_name = usuario.last_name.toLowerCase();
        let name = usuario.name.toLowerCase();
        let email = usuario.email.toLowerCase();
        if (last_name.indexOf(texto) !== -1 || name.indexOf(texto) !== -1 || email.indexOf(texto) !== -1) {
          usuarios.push(usuario);
        }
      }
      this.usuarios = usuarios;
    }
  }

}
