import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../shared/notification';
import { animate, style, transition, trigger } from '@angular/animations';
import { EquipoService } from '../../services/equipo/equipo.service';
import swal from 'sweetalert2';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { Equipo } from '../../models/equipo';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularCropperjsComponent, ImageCropperResult } from 'angular-cropperjs';
import { DomSanitizer } from '@angular/platform-browser';
import { InfoAdicionalEquiposService } from '../../services/infoAdicional-equipos/info-adicional-equipos.service';
import { ConfigAlertaEquiposService } from '../../services/equipo/config-alerta-equipos.service';
import { ConfigEquiposAlertas } from '../../models/ConfigEquiposAlertas';

@Component({
  selector: 'app-public-equipo',
  templateUrl: './public-equipo.component.html',
  styleUrls: ['./public-equipo.component.scss',
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
export class PublicEquipoComponent implements OnInit {

  modal_config: boolean = false;
  form: FormGroup;
  formconfiguraciones: FormGroup;
  item: any;
  items: any;
  columns: any[];
  user: any;
  public desplegable: boolean = false;
  public editItem: boolean = false;
  public opcionesEditItem: boolean = true;
  public ver_registros: boolean = false;
  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: "Authorization",
    authToken: "Bearer " + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,

  });
  uploaderequipo: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: "Authorization",
    authToken: "Bearer " + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,

  });
  agregarReparacion = false;
  apiurl: any;
  eventoedit: any;
  id: any;
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  editarImagen: boolean;
  public myAngularxQrCode: string = null;
  imageurl: string;
  campos = {
    activaN1: false,
    activaN2: false,
    activaN3: false,
    activaN4: false,
    activaN5: false,
    nombre3: 'a',
    nombre4: 'a',
    nombre2: 'a',
    nombre1: 'a',
    nombre5: 'a'
  };
  InfoAdicionalGlogal: any;
  configEquiposAlertas: ConfigEquiposAlertas;
  constructor(private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private equipoService: EquipoService,
    private router: Router,
    private route: ActivatedRoute,
    private configuracionesEquipoService: ConfigAlertaEquiposService,
    private InfoAdicionalEquiposService: InfoAdicionalEquiposService) {
    this.columns = [{ name: 'Nombre' },
    { name: 'Metodo', prop: 'tecnica_analitica' },
    { name: 'Tecnica analítica', prop: 'tecnica_analitica' },
    { name: 'Unidad', prop: 'unidad' },
    { name: 'valor_unit', prop: 'valor_unit' },
    { name: 'descripcion', prop: 'descripcion' }];
    this.myAngularxQrCode = window.location.href;

    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }
  cargarConfig() {
    try {
      this.InfoAdicionalEquiposService.get().subscribe( (resp: any) => {
        if (resp.success) {
          this.InfoAdicionalGlogal = resp.InfoAdicional[0];
          console.log(this.InfoAdicionalGlogal)
        }
      });
      this.configuracionesEquipoService.getconfiguracionEquipos().subscribe( (resp: any) => {
        if(resp.success) {
          this.configEquiposAlertas = resp.configuracion[0];
          console.log(this.configEquiposAlertas)
          this.campos = {
            activaN1: this.configEquiposAlertas.activaN1,
            activaN2: this.configEquiposAlertas.activaN2,
            activaN3: this.configEquiposAlertas.activaN3,
            activaN4: this.configEquiposAlertas.activaN4,
            activaN5: this.configEquiposAlertas.activaN5,
            nombre1: this.configEquiposAlertas.nombre1.toString(),
            nombre2: this.configEquiposAlertas.nombre2.toString(),
            nombre3: this.configEquiposAlertas.nombre3.toString(),
            nombre4: this.configEquiposAlertas.nombre4.toString(),
            nombre5: this.configEquiposAlertas.nombre5.toString()
          }
        } else {
          this.notificationService.addNotify({ title: 'Configuración General', msg: resp.message, type: 'error' });
        }
      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Configuración General', msg: e.message, type: 'error' });
    }
  }
  desplegableEvent(): any {
    if (this.desplegable) {
      this.desplegable = false;
    } else {
      this.desplegable = true;
    }
  }
  imprimir(qr) {
    const  a = document.createElement('a');
    a.download = `QR Equipo`;
    a.target = '_blank';
    a.href = qr['el']['nativeElement']['childNodes'][1]['currentSrc'];
    a.click();
  }
  ngOnInit() {
    this.item = new Equipo();
    this.formconfiguraciones = new FormGroup({
      email: new FormControl(null),
      Rcada: new FormControl(null),
      tiempo: new FormControl(null),
      email2: new FormControl(null),
      Rcada2: new FormControl(null),
      tiempo2: new FormControl(null),
    });
    this.form = this.formBuilder.group({
      fabricante: [null, Validators.required],
      nombre: [null, Validators.required],
      codigo: [null],
      nserie: [null],
      estado: [null, Validators.required],
      fingreso: [null, Validators.required],
      softwarefim: [],
      ubicacion: []
    });

    this.uploader.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        name: item.file.name,
        type: item.file.type
      };
    };
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

    this.uploaderequipo.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        name: item.file.name,
        type: item.file.type
      };
    };
    this.uploaderequipo.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploaderequipo.onSuccessItem = (item, response, status, headers) => this.onSuccessItemEquipo(item, response, status, headers);

    this.apiurl = environment.apiUrl;
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id != undefined) {
      this.cargardatos();
    } else {
      this.editItem = true;
      this.opcionesEditItem = false;
    }
  }
  openMyModal(event) {
    this.item = new Equipo();
    document.querySelector('#' + event).classList.add('md-show');
  }
  openModal(event): void {
    document.querySelector('#' + event).classList.add('md-show');
  }
  closeModal(event): void {
    document.querySelector('#' + event).classList.remove('md-show');
  }
  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  closeMyModalbtn(event) {
    ((event.target.parentElement.parentElement.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  guardar(event) {

    if (this.item._id == undefined) {
      this.item.tercero = this.user.tercero._id;
      this.equipoService.add(this.item).subscribe((value) => {

        this.router.navigate(['config/equipos']);
        this.cargardatos();
        this.item = new Equipo();
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Equipo almacenado con exito', type: 'success' });
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    } else {
      this.cactualizarItem(this.item);
    }
  }
  cargardatos() {
    const hoy = moment(new Date());
    this.equipoService.getByIdPublic(this.id).subscribe((value: any) => {
      this.item = value.data;
      this.item.variables.forEach((element, index) => {
        this.item.variables[index].vigencia = hoy.diff(element['proxcalibracion'], 'days');
      });
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  celiminarItem(item) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea eliminar el equipo?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.eliminarItem(item);
      }
    }
    );
  }
  eliminarItem(item) {

    this.equipoService.delete(item._id, item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Equipo eliminado con exito', type: 'success' });
      item.edit = false;
      let index = this.items.findIndex((x) => x._id == item._id);
      this.items.splice(index, 1);
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cactualizarItem(item) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea actualizar el equipo?',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.actualizarItem(item);
      }
    }
    );
  }
  actualizarItem(item) {

    if (item != undefined && item._id != undefined) {
      this.equipoService.update(item).subscribe((value) => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Equipo actualizado con exito', type: 'success' });
        item.edit = false;
        console.log(item)
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }

  }
  onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    let file = JSON.parse(response).file;
    this.item.imagen = file.filename;
    this.item.imagenoriginal = file.filename;
    this.actualizarItem(this.item);
    this.compeseurlimage();
    this.editarImagen = false;
  }
  onSuccessItemEquipo(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    let file = JSON.parse(response).file;
    if (this.item.archivos == undefined) {
      this.item.archivos = [];
    }
    this.item.archivos.push(file);
  }
  openedit(equipo) {
    this.openMyModal('effect-3');
    this.item = equipo;
    this.item.fingreso = moment(this.item.fingreso).format('YYYY-MM-DD');
  }
  calcularproximafecha(variable) {
    let valor = variable.tipofrecuencia;
    if (valor == 'Dias') {
      return moment(variable.ultcalibracion).add(variable.frecalibracion, 'days');
    } else if (valor == 'Semanas') {
      return moment(variable.ultcalibracion).add(variable.frecalibracion, 'week');
    } else if (valor == 'Meses') {
      return moment(variable.ultcalibracion).add(variable.frecalibracion, 'months');
    } else if (valor == 'Año') {
      return moment(variable.ultcalibracion).add(variable.frecalibracion, 'years');
    }
  }

  celiminardano(index) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea eliminar el registro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.item.reparaciones.splice(index, 1);

      }
    }
    );
  }
  resultImageFun(event: ImageCropperResult) {
    this.item.imagen = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg');
    this.item.firmaWidth = event.cropData.width;
    this.item.firmaHeight = event.cropData.height;
    this.editarImagen = false;
  }
  cropimage() {
    this.imageurl = this.apiurl + 'upload/files_client/' + this.item.imagenoriginal;

    this.editarImagen = !this.editarImagen;
  }
  compeseurlimage() {
    if (this.item == undefined || this.item.imagen == '' || this.item.imagen == undefined) {
      return 'assets/images/200empty.png';
    } else if (this.item.imagen.includes("data:image/jpeg")) {
      return this.item.imagen;
    }
    return this.apiurl + 'upload/files_client/' + this.item.imagen;


  }
  metodo(evento, index): void {
    switch (evento) {
      case 'ver-registros':
        this.ver_registros = true;
        this.agregarReparacion = true;
        this.eventoedit = this.item.reparaciones[index];
        break;
    }
  }


}
