import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Permisos, Rol } from '../../models/Rol';
import { Usuario } from '../../models/usuario';
import { RolesPermisosService } from '../../services/roles/roles-permisos.service';
import { NotificationService } from '../../shared/notification';
import swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'],
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
export class RolesComponent implements OnInit {

  user: Usuario;
  Roles: Rol;
  Rol: Rol;
  Permisos: Permisos;
  catchRol: boolean;
  preloader: boolean;
  constructor(private notificationService: NotificationService,
    private rolesPermisosServices: RolesPermisosService) {
    this.preloader = true;
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.Roles = new Rol();
    this.Rol = new Rol();
    this.cargaRoles();
  }

  ngOnInit() {
  }

  cargaRoles() {
    try {
      this.preloader = true;
      this.rolesPermisosServices.getRole().subscribe((resp: any) => {
        if (resp.success) {
          if (resp.cantidad === 0) {
            this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'info' });
            this.openMyModal('roles');
            this.preloader = false;
          } else {
            this.Roles = resp.roles;
            this.catchRol = true;
            this.preloader = false;
            console.log(this.Roles)
          }
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }
      });
    } catch (e) {
      return this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }
  closeModal(event) {
    document.querySelector('#' + event).classList.remove('md-show');
  }
  edit(_id: string) {
    try {
      this.rolesPermisosServices.getIdRole(_id).subscribe( (resp: any) => {
        if (resp.success) {
          this.openMyModal('roles');
          this.Rol = resp.role;
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }
      });
    } catch (e) {
      return this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }

  }
  delete(_id: string) {
    try {
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
            this.rolesPermisosServices.deleteRole(_id).subscribe( (resp: any) => {
              // TODO actualización del usuario
              if (resp.success) {
                this.cargaRoles();
                this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'success' });
                this.preloader = false;
              } else {
                this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
                this.preloader = false;
              }
            });
          }
        }
      );
    } catch (e) {
      return this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  guardarRole() {
    try {
      this.preloader = true;
      if (this.Rol._id !== undefined) {
        this.rolesPermisosServices.editRole(this.Rol).subscribe( (resp: any) => {
          if (resp.success) {
            this.closeModal('roles');
            this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'success' });
            this.cargaRoles();
            this.Rol = new Rol();
            this.preloader = false;
          } else {
            this.preloader = false;
            return this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
          }
        });
      } else {
        this.Rol.tercero = this.user.tercero._id;
        if (this.Rol.nombre !== '') {
          this.rolesPermisosServices.createRole(this.Rol).subscribe((resp: any) => {
            if (resp.success) {
              this.closeModal('roles');
              this.cargaRoles();
              this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'success' });
              this.Rol = new Rol();
              this.preloader = false;
            } else {
              this.preloader = false;
              return this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'success' });
            }
          });
        } else {
          return this.notificationService.addNotify({ title: 'Roles', msg: 'Debe expesificar un nombre al rol', type: 'success' });
        }
      }
    } catch (e) {
      return this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
}
