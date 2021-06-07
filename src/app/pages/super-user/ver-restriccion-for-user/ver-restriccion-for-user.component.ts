import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Restriccion } from '../../../models/Restriccion';
import swal from 'sweetalert2';
import { ConfiguracionesGeneralesService } from '../../../services/super-user/configuraciones-generales.service';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-ver-restriccion-for-user',
  templateUrl: './ver-restriccion-for-user.component.html',
  styleUrls: ['./ver-restriccion-for-user.component.scss',
  '../../../../assets/icon/icofont/css/icofont.scss']
})
export class VerRestriccionForUserComponent implements OnInit {
  $identificador: string;
  ListadoRestricciones: any;
  NewRestriccion: Restriccion;
  preloader = true;
  usuario: string;
  formRestricciones: FormGroup;
  formRestriccionesEdit: FormGroup;
  tipos = ['Parametros', 'Usuarios', 'Layout'];
  crear = true;
  constructor(
    private router: ActivatedRoute,
    private userService: UsuariosService,
    private configuraciones: ConfiguracionesGeneralesService) {
    this.$identificador = this.router.snapshot.paramMap.get('id');
    this.cargaUsuario();
  }

  ngOnInit() {
    this.NewRestriccion = new Restriccion();
    this.getAllUsersConfigs();
    this.cargaForms();
  }
  cargaUsuario() {
    this.userService.getById(this.$identificador).subscribe((value: any) => {
      console.log(value);
    });
  }
  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
    if (event === 'crear-restriccion') {
      this.cargaTipos('modal-crear');
    }
  }
  closeMyModal(event) {
    document.querySelector('#' + event).classList.remove('md-show');
  }
  cargaForms() {
    this.formRestricciones = new FormGroup({
      nombre: new FormControl([null]),
      tipo: new FormControl([null]),
      cantidad: new FormControl([null]),
      tercero: new FormControl([this.$identificador])
    });
    this.formRestriccionesEdit = new FormGroup({
      _id: new FormControl([null]),
      nombre: new FormControl([null]),
      tipo: new FormControl([null]),
      cantidad: new FormControl([null])
    });
  }
  getAllUsersConfigs() {
    this.configuraciones.getRestriccionForUser(this.$identificador).subscribe( (resp: any) => {
      if (resp.success) {
        this.ListadoRestricciones = resp.Restricciones;
        this.usuario = this.ListadoRestricciones[0].tercero.nombre_contacto;
        this.preloader = false;
        this.cargaTipos('modal-crear');
      } else {
        if ( resp.cantidad === 0) {
          this.preloader = false;
          this.openMyModal('crear-restriccion');
        } else {
          alert(resp.message);
          this.preloader = false;
        }
      }
    });
  }
  guardarRestriccion(methodo) {
    this.preloader = true;
    switch (methodo) {
      case 'create':
        const restriccion = {
          nombre: this.formRestricciones.value.nombre,
          tipo: this.formRestricciones.value.tipo,
          cantidad: this.formRestricciones.value.cantidad,
          tercero: this.formRestricciones.value.tercero[0]
        };
        this.configuraciones.create(restriccion).subscribe( (resp:any) =>{
          if (resp.success) {
            alert(resp.message);
            this.closeMyModal('crear-restriccion');
            this.getAllUsersConfigs();
          } else {
            this.preloader = false;
            alert(resp.message);
          }
        });
        break;
      case 'edit':
        this.configuraciones.update(this.formRestriccionesEdit.value).subscribe( (resp: any) => {
          if (resp.success) {
            this.getAllUsersConfigs();
            alert(resp.message);
            this.closeMyModal('edit-restriccion');
          } else {
            this.preloader = false;
            alert(resp.message);
          }
        });
        break;
    }
  }
  cargaTipos(origen) {
    this.tipos = ['Parametros', 'Usuarios', 'Layout'];
    switch (origen) {
      case 'modal-crear':
        this.ListadoRestricciones.forEach(element => {
          this.tipos.forEach( (tipo, index) => {
            if (this.tipos[index] === element['tipo']) {
              this.tipos.splice(index, 1);
            }
          });
        });
      break;
      case 'editar':
        this.ListadoRestricciones.forEach(element => {
          this.tipos.push(element['tipo']);
        });
        break;
    }
    if (this.tipos.length <= 0) {
      this.crear = false;
    } else {
      this.crear = true;
    }
  }
  edit(id) {
    this.cargaTipos('editar');
    this.preloader = true;
    this.configuraciones.getId(id).subscribe((resp: any) => {
      if (resp.success) {
        this.NewRestriccion = resp.Restriccion;
        this.openMyModal('edit-restriccion');
        this.preloader = false;
      } else {
        this.preloader = false;
        alert(resp.message);
      }
    });
  }
  delete(id) {
    swal({
      title: 'Alerta!',
      text: '¿ Deseas Eliminar a restricción ?',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x,
    }).then((result) => {
      this.preloader = true;
      if (result) {
        this.configuraciones.delete(id).subscribe( (resp: any) => {
          if (resp.success) {
            alert(resp.message);
            this.tipos.push(resp.tipo);
            this.getAllUsersConfigs();
          } else {
            this.preloader = false;
            alert(resp.message);
          }
        });
      }
    });
  }
}
