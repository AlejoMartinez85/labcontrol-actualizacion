import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { FileUploader } from "ng2-file-upload";
import { ValidacionMetodosConfigService } from "../../../../services/validacion-demetodos/validacion-metodos-config.service";
import { NotificationService } from "../../../../shared/notification";
@Component({
  selector: "app-carga-archivo",
  templateUrl: "./carga-archivo.component.html",
  styleUrls: ["./carga-archivo.component.scss"]
})
export class CargaArchivoComponent implements OnInit {
  @Input() id: string = "";
  @Output() guardarPDF: EventEmitter<boolean> = new EventEmitter();
  uploaderarchivo: FileUploader = new FileUploader({
    url: environment.apiUrl + "upload",
    authTokenHeader: "Authorization",
    authToken: "Bearer " + localStorage.getItem("access_token"),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024
  });
  apiurl: string;
  btnGuardar: boolean = false;
  archivos: any = [];
  validacion: any;
  constructor(
    private ValidacionMetodoService: ValidacionMetodosConfigService,
    private notificationService: NotificationService
  ) {
    this.apiurl = environment.apiUrl;
  }

  ngOnInit() {
    if ( this.id !== '') {
      this.ValidacionMetodoService.getId(this.id).subscribe( (resp : any) => {
        if (resp.success) {
          this.validacion = resp.validacion;
          this.archivos = resp.validacion['archivos'];
            this.btnGuardar = true;
        }
      })
    }
    this.uploaderarchivo.onAfterAddingFile = (file: any) => {
      file.withCredentials = false;
    };
    this.uploaderarchivo.onSuccessItem = (item, response, status, headers) => {
      let file = JSON.parse(response).file;
      this.archivos.push(file);
      console.log(this.archivos);
    };
  }
  delFile(archivo) {
    let index = this.archivos.indexOf(archivo);
    this.archivos.splice(index, 1);
  }
  guardar() {
    this.validacion.archivos = this.archivos;
    this.ValidacionMetodoService.edit(this.validacion).subscribe( (resp: any) => {
      console.log(resp)
      if(resp.success) {
        this.notificationService.addNotify({ title: 'Archivos', msg: resp.message, type: 'success' });
      }
    })
    // console.log(this.validacion);
  }
}
