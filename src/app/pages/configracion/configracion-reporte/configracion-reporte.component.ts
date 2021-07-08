import { Component, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { NotificationService } from '../../../shared/notification';
import swal from 'sweetalert2';
import { Cliente } from '../../../models/cliente';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { ConfiguracionReporteService } from '../../../services/configuracion-reporte/configuracion-reporte.service';

@Component({
  selector: 'app-configracion-reporte',
  templateUrl: './configracion-reporte.component.html',
  styleUrls: ['./configracion-reporte.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class ConfigracionReporteComponent implements OnInit {
  @ViewChild('myckeditor') ckeditor: any;
  @ViewChild('myckeditor2') ckeditor2: any;
  @ViewChild('myckeditor3') ckeditor3: any;
  @ViewChild('editorPie') editorPie: any;
  @ViewChild('editorPie2') editorPie2: any;
  @ViewChild('editorPie3') editorPie3: any;
  @ViewChild('modaladd') modaladd: any;
  cliente: any;
  user: any;
  ckeconfig: any;
  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg']
  });
  apiurl: string;
  editorImg: any;
  imagenSel: any;
  constructor(private clienteService: ClienteService,
    private notificationService: NotificationService) {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.cliente = new Cliente();
    this.ckeconfig = {
      allowedContent: false,
      extraPlugins: 'divarea',

    };
    this.uploader.onWhenAddingFileFailed = (fileItem, filter) => {
      if (filter.name = 'mimeType') {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Solo se permite archivos de tipo imagen ', type: 'error' });
      }
    };
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    this.apiurl = environment.apiUrl;
    this.cargardatos();
  }

  onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    const file = JSON.parse(response).file;
    this.cliente.imagenes.push(file);
    this.actualizarItem(this.cliente);
  }
  cargardatos() {
    this.clienteService.getById(this.user.tercero._id).subscribe((value: any) => {
      this.cliente = value.clientes;

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }

  addVariable(event, editor) {
    // Cargo,Fecha hoy, telèfono responsable, email responsable
    const editroSel = this.seleccioareditor(editor);

    editroSel.instance.insertHtml('{' + event.target.value + '}');


  }
  seleccioareditor(editor) {
    switch (editor) {
      case 'myckeditor':
        return this.ckeditor;
      case 'myckeditor2':
        return this.ckeditor2;
      case 'myckeditor3':
        return this.ckeditor3;
      case 'editorPie':
        return this.editorPie;
      case 'editorPie2':
        return this.editorPie2;
      case 'editorPie3':
        return this.editorPie3;
    }
  }
  cactualizarItem() {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas actualizar el encabezado del reporte?',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.cliente.cambiopassword = false;
        this.actualizarItem(this.cliente);
      }

    );
  }
  actualizarItem(item) {
    this.clienteService.update(item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Uusario actualizado con exito', type: 'success' });
      item.edit = false;
      console.log(value);

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  openMyModal(event, editorImg) {
    document.querySelector('#' + event).classList.add('md-show');
    this.editorImg = editorImg;
  }
  closeMyModal(event) {
    document.querySelector('#effect-3').classList.remove('md-show');
  }
  insertarImagen(imagen, event) {
    const urlImg = this.apiurl + 'upload/files_client/' + imagen.filename + '?name=' + imagen.originalname;
    const editoSel = this.seleccioareditor(this.editorImg);
    editoSel.instance.insertHtml('<img src="' + urlImg + '" >');
    this.notificationService.addNotify({ title: 'Alerta', msg: 'Imagen insertada con exito', type: 'success' });
    this.closeMyModal(event);
  }

  delimagen(imagen) {
    this.imagenSel = imagen;
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar la imagen?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        const index = this.cliente.imagenes.indexOf(this.imagenSel);
        if (index > -1) {

          this.cliente.imagenes.splice(index, 1);
          this.actualizarItem(this.cliente);
        }

    });
  }
}
