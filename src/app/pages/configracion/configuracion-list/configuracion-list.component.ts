import { Component, OnInit, ViewChild } from '@angular/core';
import { Estructura } from '../../../models/estructura';
import { ConfiguracionReporteService } from '../../../services/configuracion-reporte/configuracion-reporte.service';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { EstructuraServiceService } from '../../../services/Estructura/Estructura-service.service';
import { environment } from '../../../../environments/environment';
import swal from 'sweetalert2';
import { NotificationService } from '../../../shared/notification';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfiguracionesGeneralesService } from '../../../services/super-user/configuraciones-generales.service';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
@Component({
  selector: 'app-configuracion-list',
  templateUrl: './configuracion-list.component.html',
  styleUrls: ['./configuracion-list.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class ConfiguracionListComponent implements OnInit {

  @ViewChild('headerCreate') headerCreate: any;
  @ViewChild('headerEdit') headerEdit: any;
  @ViewChild('footerCreate') footerCreate: any;
  @ViewChild('footerEdit') footerEdit: any;
  @ViewChild('modaladd') modaladd: any;
  cliente: any;
  user: any;
  desde: number;
  estado: boolean = false;
  restriccionCreacion: boolean = true;
  continue: boolean = true;
  estructuras: any = [];
  estructuraSingel: Estructura;
  $identificadorParametroConfig: string;
  apiurl: string;
  editorImg: any;
  imagenSel: any;
  ckeconfig: any;
  imagenes = [];
  formEncavezados: FormGroup;
  formEncavezadosEdit: FormGroup;
  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg']
  });
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  constructor(
    private configuracionReporteService: ConfiguracionReporteService,
    private estructuraService: EstructuraServiceService,
    private notificationService: NotificationService,
    private Restriccion: ConfiguracionesGeneralesService,
    private rolesPermisosServices: RolesPermisosService) {
      this.Permisos = new Permisos();
    this.ckeconfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
    };
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.configReportes[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
    this.uploader.onWhenAddingFileFailed = (fileItem, filter) => {
      if (filter.name = 'mimeType') {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Solo se permite archivos de tipo imagen ', type: 'error' });
      }
    };
  }

  iniciarForm() {
    this.formEncavezados = new FormGroup({
      nombre: new FormControl([null]),
      header: new FormControl([null]),
      footer: new FormControl([null])
    });
    this.formEncavezadosEdit = new FormGroup({
      nombre: new FormControl([null]),
      header: new FormControl([null]),
      footer: new FormControl([null]),
      _id: new FormControl([null])
    });
  }
  ngOnInit() {
    this.cargarConfiguracion();
    this.cargaEstructuras(0);
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    this.apiurl = environment.apiUrl;
    this.iniciarForm();
    this.cargarRestricciones();
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.configReportes[0];
          console.log(this.permisosLocal)
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  cargarRestricciones() {
    this.Restriccion.get().subscribe( (resp: any) => {
      console.log(resp);
      if ( resp.success ) {
        resp.Restricciones.forEach( element => {
          if ( element.tipo === 'Layout') {
            if (this.estructuras.length === element.cantidad) {
              this.restriccionCreacion = false;
            } else {
              this.restriccionCreacion = true;
            }
          }
        })
      }
    });
  }
  openModal(element) {
    document.querySelector('#' + element).classList.add('md-show');
  }
  closeModal(element) {
    document.querySelector('#' + element).classList.remove('md-show');
  }
  openMyModal(event, editorImg) {
    document.querySelector('#' + event).classList.add('md-show');
    this.editorImg = editorImg;
  }
  insertarImagen(imagen, event) {
    const urlImg = this.apiurl + 'upload/files_client/' + imagen.filename + '?name=' + imagen.originalname;
    const editoSel = this.seleccioareditor(this.editorImg);
    editoSel.instance.insertHtml('<img src="' + urlImg + '" >');
    this.closeMyModal('effect-3');
  }
  onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    const file = JSON.parse(response).file;
    this.imagenes.push(file);
  }
  closeMyModal(event) {
    document.querySelector('#' + event).classList.remove('md-show');
  }
  cantida(cantidad: any): void {
    if (parseInt(cantidad.value) > 0) {
      const valor = {
        numeroMuestras: parseInt(cantidad.value),
        tercero: this.user.tercero._id
      };
      if (this.$identificadorParametroConfig != undefined) {
        this.configuracionReporteService.edit(this.$identificadorParametroConfig,
          { numeroMuestras: parseInt(cantidad.value) }
        ).subscribe(resp => {
          if (resp.success) {
            if (resp.configuracion.length !== 0) {
              this.cargarConfiguracion();
            }
          }
        })
      } else {
        this.configuracionReporteService.add(valor).subscribe(resp => {
          if (resp.success) {
            this.cargarConfiguracion();
          }
        });
      }
    } else {
      alert('La cantidad de Muestras definidas por reporte no deben ser menores o iguales a 0');
      return;
    }
  }
  cargarConfiguracion(): void {
    this.configuracionReporteService.get().subscribe((resp: any) => {
      if (resp.success) {
        if (resp.configuracion.length !== 0) {
          this.$identificadorParametroConfig = resp.configuracion[0]._id;
          document.getElementById('inlineFormInputGroup')['value'] = resp.configuracion[0].numeroMuestras;
        } else {
          const valor = {
            numeroMuestras: 3,
            tercero: this.user.tercero._id
          };
          this.configuracionReporteService.add(valor).subscribe((respuesta: any) => {
            if (respuesta.success) {
              this.$identificadorParametroConfig = respuesta.configuracion[0]._id;
              document.getElementById('inlineFormInputGroup')['value'] = respuesta.configuracion[0].numeroMuestras;
            }
          });
        }
      }
    });
  }
  cargaEstructuras(desde) {
    this.desde = desde;
    if (desde < 0) {
      this.desde = 0;
    }
    if (this.desde !== 0) {
      this.estado = true;
    }
    this.estructuraService.get(this.desde).subscribe((listadoEstructuras: any) => {
      if (listadoEstructuras.success) {
        this.estructuras = listadoEstructuras.Layouts;
        if (listadoEstructuras.Layouts.length < 10) {
          this.continue = false;
        } else {
          this.continue = true;
        }
      } else {
        if (listadoEstructuras.cantidad === 0) {
          this.openModal('crear-estructura');
          alert(listadoEstructuras.message);
        } else {
          alert(listadoEstructuras.message);
        }
      }
    });
  }
  deleteEstructura(id) {
    swal({
      title: 'Alerta!',
      text: '¿Realmente deseas eliminar la Estructura?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true
    }).then((result) => {

      this.estructuraService.delete(id).subscribe((respuesta: any) => {
        if (respuesta.success) {
          alert(respuesta.message);
          this.cargaEstructuras(0);
        } else {
          alert(respuesta.message);
        }
      });

    });
  }
  buscarEstructura(event) {
    this.estructuraService.busqueda(event.target.value).subscribe((respuesta: any) => {

      if (respuesta.success) {
        this.estructuras = respuesta.layouts;
      } else {
        alert(respuesta.message);
      }

    });
  }
  addVariable(event, editor) {
    const editroSel = this.seleccioareditor(editor);
    editroSel.instance.insertHtml('{' + event.target.value + '}');
  }
  seleccioareditor(editor) {
    switch (editor) {
      case 'headerCreate':
        return this.headerCreate;
      case 'headerEdit':
        return this.headerEdit;
      case 'footerCreate':
        return this.footerCreate;
      case 'footerEdit':
        return this.footerEdit;
    }
  }
  delimagen(imagen) {
    this.imagenSel = imagen;
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar la imagen?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true
    }).then((result) => {

      const index = this.cliente.imagenes.indexOf(this.imagenSel);
      if (index > -1) {
        this.cliente.imagenes.splice(index, 1);
      }

    });
  }
  GuardarForm() {
    const estructura = {
      nombre: this.formEncavezados.value.nombre,
      header: this.formEncavezados.value.header,
      footer: this.formEncavezados.value.footer,
      tercero: this.user.tercero._id
    };
    this.estructuraService.create(estructura).subscribe((respuesta: any) => {
      console.log(respuesta);
      if (respuesta.success) {
        this.closeModal('crear-estructura');
        alert(respuesta.message);
        this.cargaEstructuras(0);
      } else {
        alert(respuesta.message);
      }
    });
  }
  GuardarFormEdit() {
    const estructura = {
      nombre: this.formEncavezadosEdit.value.nombre,
      header: this.formEncavezadosEdit.value.header,
      footer: this.formEncavezadosEdit.value.footer,
      _id: this.formEncavezadosEdit.value._id
    };
    this.estructuraService.edit(estructura).subscribe((respuestaEditada: any) => {
      if (respuestaEditada.success) {
        alert(respuestaEditada.message);
        this.closeModal('edit-estructura');
        this.cargaEstructuras(0);
      } else {
        alert(respuestaEditada.message);
      }
    });
  }
  getId(id: string, metodo: string) {
    this.estructuraService.getId(id).subscribe((estructuraResp: any) => {

      if (estructuraResp.success) {
        switch (metodo) {
          case 'edit':
            this.formEncavezadosEdit.setValue({
              nombre: estructuraResp.Layout.nombre,
              header: estructuraResp.Layout.header,
              footer: estructuraResp.Layout.footer,
              _id: estructuraResp.Layout._id
            });
            this.openModal('edit-estructura');
            break;
          case 'ver':
            this.estructuraSingel = estructuraResp.Layout;
            document.getElementById('nombre').innerHTML = estructuraResp.Layout.nombre;
            document.getElementById('updatedAt').innerHTML = estructuraResp.Layout.updatedAt;
            document.getElementById('header').innerHTML = estructuraResp.Layout.header;
            document.getElementById('footer').innerHTML = estructuraResp.Layout.footer;
            this.openModal('view-estructura');
            break;
        }
      } else {
        alert(estructuraResp.message);
      }

    });
  }
}
