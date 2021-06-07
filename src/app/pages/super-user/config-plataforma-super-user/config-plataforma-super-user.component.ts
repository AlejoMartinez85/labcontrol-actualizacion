import { Component, OnInit } from '@angular/core';
import { Restriccion } from '../../../models/Restriccion';
import { ConfiguracionesGeneralesService } from '../../../services/super-user/configuraciones-generales.service';
import swal from 'sweetalert2';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-config-plataforma-super-user',
  templateUrl: './config-plataforma-super-user.component.html',
  styleUrls: ['./config-plataforma-super-user.component.scss',
  '../../../../assets/icon/icofont/css/icofont.scss'],
})
export class ConfigPlataformaSuperUserComponent implements OnInit {

  ListadoRestricciones: any;
  NewRestriccion: Restriccion;
  usuarios: any;
  formRestricciones: FormGroup;
  formRestriccionesEdit: FormGroup;
  preloader = true;
  tipos = ['Parametros', 'Usuarios', 'Layout'];
  constructor(
    private configuraciones: ConfiguracionesGeneralesService,
    private userService: UsuariosService) { }

  ngOnInit() {
    this.NewRestriccion = new Restriccion();
    this.getAllUsersConfigs();
    this.cargarEmpresa();
    this.cargaForms();
  }
  cargaForms() {
    this.formRestricciones = new FormGroup({
      nombre: new FormControl([null]),
      tipo: new FormControl([null]),
      cantidad: new FormControl([null]),
      tercero: new FormControl([null])
    });
    this.formRestriccionesEdit = new FormGroup({
      _id: new FormControl([null]),
      nombre: new FormControl([null]),
      tipo: new FormControl([null]),
      cantidad: new FormControl([null])
    });
  }
  getAllUsersConfigs() {
    this.configuraciones.getAllUsers().subscribe( (valor: any) => {
      if (valor.success) {
        this.ListadoRestricciones = valor.restricciones;
        this.preloader = false;
      }
    });
  }
  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }
  closeMyModal(event) {
    document.querySelector('#' + event).classList.remove('md-show');
  }
  cargarEmpresa() {
    this.usuarios = [];
    this.userService.get(1).subscribe(resp => {
      resp.forEach( element => {
        this.usuarios.push(element);
      });
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
          tercero: this.formRestricciones.value.tercero
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
  edit(id) {
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
