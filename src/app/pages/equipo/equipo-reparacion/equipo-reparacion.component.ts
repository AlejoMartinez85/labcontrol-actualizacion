import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { animate, style, transition, trigger } from '@angular/animations';
import { Reparacion } from '../../../models/reparacion';
import { ParametroService } from '../../../services/parametro/parametro.service';
import * as moment from 'moment';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-equipo-reparacion',
  templateUrl: './equipo-reparacion.component.html',
  styleUrls: ['./equipo-reparacion.component.scss',
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

export class EquipoReparacionComponent implements OnInit {

  camposMedicion: boolean = false;
  form: FormGroup;
  item: any;
  items: any;
  columns: any[];
  user: any;
  input_required: boolean;
  @Input() ver_registros: number = 0;
  @Input() AgregarArchivos: boolean = true;
  observacion: any;
  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: "Authorization",
    authToken: "Bearer " + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,

  });
  @Output() endAction = new EventEmitter<any>();
  @Input() eventoedit: any;
  @Input() clasificaciones: any;
  apiurl: string;
  Otro: boolean;
  constructor(private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private parametroService: ParametroService) {
    this.columns = [{ name: 'Nombre' },
    { name: 'Metodo', prop: 'tecnica_analitica' },
    { name: 'Tecnica analítica', prop: 'tecnica_analitica' },
    { name: 'Unidad', prop: 'unidad' },
    { name: 'valor_unit', prop: 'valor_unit' },
    { name: 'descripcion', prop: 'descripcion' }];
    this.Otro = false;
    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }
  seleccionaClasificacion(value): void {
    if (value === 'Otro') {
      this.Otro = true;
    } else {
      this.Otro = false;
    }
  }
  ngOnInit() {
    console.log('ejecute onInit')
    this.item = new Reparacion();
    this.form = this.formBuilder.group({
      clasificacion: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaNovedad: [new Date(), Validators.required]
    });
    this.uploader.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        name: item.file.name,
        type: item.file.type
      };
    };
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    this.apiurl = environment.apiUrl;

    if (this.eventoedit != null) {
      this.item = this.eventoedit;
      this.item.fechaNovedad = moment(this.item.fechaNovedad).format('YYYY-MM-DD');
    }else if (this.item.fechaNovedad == undefined){
      this.item.fechaNovedad = moment().format('YYYY-MM-DD');
    }
    // console.log(this.item)
  }

  guardar(event) {
    
    if (this.Otro) {
      this.item.clasificacion = document.getElementById('clasificacion-id-singel')['value'];
    }
    console.log(this.item);
    this.endAction.emit(this.item);
  }
  cancelar(event) {
    this.endAction.emit(undefined);
    this.ver_registros = 0;

  }
  agregarObservacion() {
    if (this.item.observaciones == undefined) {
      this.item.observaciones = [];
    }
    this.item.observaciones.push({ obs: this.observacion, name: this.user.name, fecha: moment().toDate() });
    this.observacion = '';
  }
  onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    const file = JSON.parse(response).file;
    if (this.item.archivos == undefined) {
      this.item.archivos = [];
    }
    this.item.archivos.push(file);
  }
  changueFechas(changeFecha: boolean): void {
    this.camposMedicion = changeFecha;
  }
}
