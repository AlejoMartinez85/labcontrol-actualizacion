import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ModuleWithComponentFactories, OnChanges, SimpleChanges } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { Ensayo } from '../../../models/ensayo';
@Component({
  selector: 'app-cargar-archivos',
  templateUrl: './cargar-archivos.component.html',
  styleUrls: ['./cargar-archivos.component.scss']
})
export class CargarArchivosComponent implements OnInit, OnChanges {

  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: "Authorization",
    authToken: "Bearer " + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
  });
  @Input() ensayo: Ensayo;
  @Input() lab: Boolean;
  @Input() muestraTitulo: string;
  @Input() tituloarchivosCargados: string;
  @Input() info: string;
  @Input() informacionbaner: string;
  @Input() tipo: string;
  @Output() uploadfile = new EventEmitter<any>();
  apiurl: string;
  archivoslab: any[];
  user: any;
  archivos: any[];
  constructor() {

    this.apiurl = environment.apiUrl;
    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    this.separarArchivos();
  }

  onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {

    if (this.ensayo.archivos == undefined) {
      this.ensayo.archivos = [];
    }
    let file = JSON.parse(response).file;
    file.tipo = this.tipo;
    this.ensayo.archivos.push(file);
    this.separarArchivos();
    this.uploadfile.emit(this.ensayo.archivos);
  }
  separarArchivos() {
    this.archivoslab = [];
    this.archivos = [];
    if (this.ensayo.archivos != undefined) {
      this.ensayo.archivos.forEach(archivo => {
        if (archivo.tercero == this.ensayo.tercero && archivo.tipo == this.tipo) {
          this.archivoslab.push(archivo);
        } else if (archivo.tipo == this.tipo) {
          this.archivos.push(archivo);
        }
      });
    }

  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    this.ensayo = changes.ensayo.currentValue;
    this.separarArchivos();
  }
  getmsg() {
    if (this.info == undefined) {
      return "Soportes de pago y documentos adjuntos";
    } else {
      return this.info;
    }
  }
  delFile(archivo) {
    let index = this.ensayo.archivos.indexOf(archivo);
    this.ensayo.archivos.splice(index, 1);
    this.uploadfile.emit(this.ensayo.archivos);
    this.separarArchivos();
  }

}
