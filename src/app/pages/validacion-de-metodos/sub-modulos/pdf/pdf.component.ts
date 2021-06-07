import { Component, Input, OnInit, Output, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { ValidacionMetodosConfigService } from '../../../../services/validacion-demetodos/validacion-metodos-config.service';
import { NotificationService } from '../../../../shared/notification';
@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss','../../../../../assets/icon/icofont/css/icofont.scss']
})
export class PdfComponent implements OnInit {

  @Input() id: string = '';
  @Output() guardarPDF: EventEmitter<boolean> = new EventEmitter();
  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
  });
  estilos = { 'height': '0', 'overflow': 'auto', 'display': 'block' };
  apiurl: string;
  btnGuardar: boolean = false;
  pdf:string = '';
  validacion:any;
  constructor(private ValidacionMetodoService: ValidacionMetodosConfigService,private notificationService: NotificationService) {
    this.apiurl = environment.apiUrl;
    
  }

  ngOnInit() {
    if ( this.id !== '') {
      this.ValidacionMetodoService.getId(this.id).subscribe( (resp : any) => {
        if (resp.success) {
          this.validacion = resp.validacion;
          this.pdf = resp.validacion['urlPdf'];
          if (this.pdf !== '') {
            this.estilos = { 'height': '500px', 'overflow': 'auto', 'display': 'block' };
            this.btnGuardar = true;
          }
        }
      })
    }
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.pdf = `${this.apiurl}upload/files_client/${JSON.parse(response).file.filename}`;
      this.estilos = { 'height': '500px', 'overflow': 'auto', 'display': 'block' };
      this.btnGuardar = true;
    };
  }

  guardar() {
    this.validacion['urlPdf'] = this.pdf;
    this.ValidacionMetodoService.edit(this.validacion).subscribe( resp => {
      console.log(resp)
      if (resp.success) {
        this.notificationService.addNotify({ title: 'PDF', msg: resp.message, type: 'success' });
        this.guardarPDF.emit(true);
      }else {
        this.notificationService.addNotify({ title: 'PDF', msg: resp.message, type: 'error' });
        this.guardarPDF.emit(false);
      }
    });
  }
  deletePDF(){
    this.validacion['urlPdf'] = '';
    this.pdf = '';
    this.ValidacionMetodoService.editPdf(this.validacion).subscribe( resp => {
      console.log(resp)
      if (resp.success) {
        this.notificationService.addNotify({ title: 'PDF', msg: resp.message, type: 'success' });
        this.pdf = '';
        this.validacion['urlPdf'] = '';
        this.guardarPDF.emit(true);
        location.reload();
      }else {
        this.notificationService.addNotify({ title: 'PDF', msg: resp.message, type: 'error' });
        this.guardarPDF.emit(false);
      }
    });
  }
}
