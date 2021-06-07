import { Component, OnInit } from '@angular/core';
import { Permisos } from '../../../models/Rol';
import { DerivaIstrumentalService } from '../../../services/deriva-istrumental/deriva-istrumental.service';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
import { NotificationService } from '../../../shared/notification';

@Component({
  selector: 'app-deriva-instrumental',
  templateUrl: './deriva-instrumental.component.html',
  styleUrls: ['./deriva-instrumental.component.scss',
  '../../../../assets/icon/icofont/css/icofont.scss']
})
export class DerivaInstrumentalComponent implements OnInit {
  exactitudes = [];
  preloader = false;
  user: any;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  constructor(private derivadaService: DerivaIstrumentalService,
    private notificationService: NotificationService,
    private rolesPermisosServices: RolesPermisosService) {
      this.Permisos = new Permisos();
      this.user = JSON.parse(localStorage.getItem('userInfo'));
    }
  ngOnInit() {
    this.cargarTabla();
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.Deriva[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.Deriva[0];
          console.log(this.permisosLocal);
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  cargarTabla() {
    this.derivadaService.getAllExactitudes().subscribe( resp => {
      if (resp.success){
        this.notificationService.addNotify({ title: 'Deriva Instrumental', msg: resp.message, type: 'success' });
        this.exactitudes = resp['puntos'];
      } else {
        this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
      }
    });
  }

}
