import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { animate, style, transition, trigger } from '@angular/animations';
import { Parametro } from '../../../models/parametro';
import { EquipoService } from '../../../services/equipo/equipo.service';
import swal from 'sweetalert2';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { Equipo } from '../../../models/equipo';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
// import { AngularCropperjsComponent, ImageCropperResult } from 'angular-cropperjs';
import { CropperComponent, ImageCropperResult } from 'angular-cropperjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigAlertaEquiposService } from '../../../services/equipo/config-alerta-equipos.service';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
import { ConfigEquiposAlertas } from '../../../models/ConfigEquiposAlertas';
import { InfoAdicionalEquiposService } from '../../../services/infoAdicional-equipos/info-adicional-equipos.service';
@Component({
  selector: 'app-equipo-update',
  templateUrl: './equipo-update.component.html',
  styleUrls: [
    './equipo-update.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
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
export class EquipoUpdateComponent implements OnInit {
  @ViewChild('clasificacion-id') clasificacionID: ElementRef;
  @ViewChild('myckeditorInfoAdicional') myckeditorInfoAdicional: any;
  @ViewChild('myckeditorinfoAdicionalHeader')
  myckeditorinfoAdicionalHeader: any;
  modal_config: boolean = false;
  ckeconfig: any;
  ckeconfig2: any;
  form: FormGroup;
  formaEventos: FormGroup;
  formconfiguraciones: FormGroup;
  item: any;
  items: any;
  columns: any[];
  user: any;
  editorImg: any;
  imagenSel: any;
  clasificaciones = [];
  repeticiones = [
    { valor: 'dia', nombre: 'Días' },
    { valor: 'semana', nombre: 'Semana' },
    { valor: 'mes', nombre: 'Mes' },
    { valor: 'ano', nombre: 'Año' }
  ];
  public desplegable: boolean = false;
  public editItem: boolean = false;
  public opcionesEditItem: boolean = true;
  public ver_registros: number = 0;
  cantEventos: number = 0;
  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg']
  });
  ViewVariables = false;
  uploaderequipo: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024
  });
  uploaderImagenEditor: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg']
  });
  agregarReparacion = false;
  newRepair = false;
  apiurl: any;
  eventoedit: any;
  id: any;
  @ViewChild('angularCropper') public angularCropper: CropperComponent;
  // @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  editarImagen: boolean;
  public myAngularxQrCode: string = null;
  imageurl: string;
  cargaEventos = [];
  siguiente: boolean = true;
  atras: boolean = false;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false
  };
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
  Permisos: Permisos;
  configEquiposAlertas: ConfigEquiposAlertas;
  Otro: boolean;
  preloader: boolean;
  InfoAdicionalGlogal: any;
  imagenes: any = [];
  emails1: any[] = [];
  emails2: any[] = [];
  constructor(
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private equipoService: EquipoService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private configuracionesEquipoService: ConfigAlertaEquiposService,
    private rolesPermisosServices: RolesPermisosService,
    private InfoAdicionalEquiposService: InfoAdicionalEquiposService
  ) {
    this.ckeconfig = {
      allowedContent: false,
      extraPlugins: 'divarea'
    };
    this.ckeconfig2 = {
      allowedContent: false,
      extraPlugins: 'divarea'
    };
    this.Otro = false;
    this.preloader = true;
    this.columns = [
      { name: 'Nombre' },
      { name: 'Metodo', prop: 'tecnica_analitica' },
      { name: 'Tecnica analítica', prop: 'tecnica_analitica' },
      { name: 'Unidad', prop: 'unidad' },
      { name: 'valor_unit', prop: 'valor_unit' },
      { name: 'descripcion', prop: 'descripcion' }
    ];
    if (document.domain === 'localhost') {
      this.myAngularxQrCode = `${
        document.domain
      }:4200/equipo/public/${this.route.snapshot.paramMap.get('id')}`;
    } else {
      this.myAngularxQrCode = `${
        document.domain
      }/app/equipo/public/${this.route.snapshot.paramMap.get('id')}`;
    }
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.Permisos = new Permisos();
  }
  cargarConfig() {
    try {
      this.InfoAdicionalEquiposService.get().subscribe((resp: any) => {
        if (resp.success) {
          this.InfoAdicionalGlogal = resp.InfoAdicional[0];
          console.log(this.InfoAdicionalGlogal);
          this.item.infoAdicionalHeader = this.InfoAdicionalGlogal[
            'infoAdicionalHeader'
          ];
          this.item.infoAdicional = this.InfoAdicionalGlogal['infoAdicional'];
        }
      });
      this.configuracionesEquipoService
        .getconfiguracionEquipos()
        .subscribe((resp: any) => {
          if (resp.success) {
            this.configEquiposAlertas = resp.configuracion[0];
            // console.log(this.configEquiposAlertas)
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
            };
            this.clasificaciones = this.configEquiposAlertas['clasificaciones'];
          } else {
            this.notificationService.addNotify({
              title: 'Configuración General',
              msg: resp.message,
              type: 'error'
            });
          }
        });
    } catch (e) {
      this.notificationService.addNotify({
        title: 'Configuración General',
        msg: e.message,
        type: 'error'
      });
    }
  }
  seleccionaClasificacion(value): void {
    if (value === 'Otro') {
      this.Otro = true;
    } else {
      this.Otro = false;
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
    const a = document.createElement('a');
    a.download = `QR Equipo`;
    a.target = '_blank';
    a.href = qr['el']['nativeElement']['childNodes'][1]['currentSrc'];
    a.click();
  }
  ngOnInit() {
    this.item = new Equipo();
    this.formconfiguraciones = new FormGroup({
      email: new FormControl(null),
      emails1: new FormControl(null),
      Rcada: new FormControl(null),
      tiempo: new FormControl(null),
      email2: new FormControl(null),
      emails2: new FormControl(null),
      Rcada2: new FormControl(null),
      tiempo2: new FormControl(null),
      avisarCorreo: new FormControl(null)
    });
    this.form = this.formBuilder.group({
      fabricante: [null, Validators.required],
      nombre: [null, Validators.required],
      codigo: [null],
      nserie: [null],
      estado: [null, Validators.required],
      fingreso: [null, Validators.required],
      softwarefim: [],
      ubicacion: [],
      nombre1: [null],
      nombre2: [null],
      nombre3: [null],
      nombre4: [null],
      nombre5: [null],
      infoAdicional: [null],
      infoAdicionCabecera: [null]
    });
    this.formaEventos = new FormGroup({
      clasificacion: new FormControl('', Validators.required),
      fechaInicio: new FormControl(moment().format(), Validators.required),
      fechaFin: new FormControl('', Validators.required),
      intervalo: new FormControl('', Validators.required),
      repetirCada: new FormControl('', Validators.required)
    });

    this.uploaderImagenEditor.onAfterAddingFile = (file: any) => {
      file.withCredentials = false;
    };
    this.uploaderImagenEditor.onSuccessItem = (
      item,
      response,
      status,
      headers
    ) => this.onSuccessItemImagenEditor(item, response, status, headers);

    this.uploader.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        name: item.file.name,
        type: item.file.type
      };
    };
    this.uploader.onAfterAddingFile = (file: any) => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, response, status, headers) =>
      this.onSuccessItem(item, response, status, headers);

    this.uploaderequipo.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        name: item.file.name,
        type: item.file.type
      };
    };
    this.uploaderequipo.onAfterAddingFile = (file: any) => {
      file.withCredentials = false;
    };
    this.uploaderequipo.onSuccessItem = (item, response, status, headers) =>
      this.onSuccessItemEquipo(item, response, status, headers);

    this.apiurl = environment.apiUrl;
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id != undefined) {
      this.cargardatos();
    } else {
      this.editItem = true;
      this.opcionesEditItem = false;
      this.preloader = false;
    }
    if (localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.Equipos[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
    this.cargarConfig();
  }
  onSuccessItemImagenEditor(
    item: FileItem,
    response: any,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    let file = JSON.parse(response).file;
    this.imagenes.push(file);
  }

  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe((resp: any) => {
        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.Equipos[0];
        } else {
          this.notificationService.addNotify({
            title: 'Roles',
            msg: resp.message,
            type: 'error'
          });
        }
      });
    } catch (e) {
      this.notificationService.addNotify({
        title: 'Roles',
        msg: e.message,
        type: 'error'
      });
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
    event.target.parentElement.parentElement.parentElement.classList.remove(
      'md-show'
    );
  }
  closeMyModalbtn(event) {
    event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.remove(
      'md-show'
    );
  }
  deletearr(email, tipo) {
    try {
      switch (tipo) {
        case 'emails1':
          this.emails1.splice(email, 1);
          break;
        case 'emails2':
          this.emails2.splice(email, 1);
          break;
      }
    } catch (error) {
      alert(error);
    }
  }
  addemails(email, tipo) {
    try {
      switch (tipo) {
        case 'emails1':
          this.emails1.push(email);
          document.getElementById('idemails1')['value'] = '';
          break;
        case 'emails2':
          this.emails2.push(email);
          document.getElementById('idemails2')['value'] = '';
          break;
      }
    } catch (error) {
      alert(error);
    }
  }
  guardar(event) {
    if (this.item._id == undefined) {
      /**
       * configuración
       */
      this.configuracionesEquipoService
        .getconfiguracionEquipos()
        .subscribe((resp: any) => {
          if (resp.success) {
            const Calibraciones = {
              email: resp.configuracion[0].email,
              emails1: resp.configuracion[0].emails1,
              Rcada: resp.configuracion[0].Rcada,
              tiempo: resp.configuracion[0].tiempo
            };
            const Mantenimientos = {
              email: resp.configuracion[0].email2,
              emails2: resp.configuracion[0].emails2,
              Rcada: resp.configuracion[0].Rcada2,
              tiempo: resp.configuracion[0].tiempo2
            };
            this.item.calibraciones = Calibraciones;
            this.item.mantenimientos = Mantenimientos;
            this.item.avisarCorreo = resp.configuracion[0].avisarCorreo;
            this.item.tercero = this.user.tercero._id;
            if (
              this.item.infoAdicionalHeader === '' ||
              this.item.infoAdicionalHeader === undefined
            ) {
              this.item.infoAdicionalHeader = this.InfoAdicionalGlogal[
                'infoAdicionalHeader'
              ];
            }
            if (
              this.item.infoAdicional === '' ||
              this.item.infoAdicional === undefined
            ) {
              this.item.infoAdicional = this.InfoAdicionalGlogal[
                'infoAdicional'
              ];
            }
            // console.log(this.item)
            // console.log(this.item.infoAdicionalHeader)
            // console.log(this.item.infoAdicional)
            this.equipoService.add(this.item).subscribe(
              (value: any) => {
                this.router.navigate(['config/equipos']);
                this.cargardatos();
                this.item = new Equipo();
                this.notificationService.addNotify({
                  title: 'Alerta',
                  msg: 'Equipo almacenado con exito',
                  type: 'success'
                });
              },
              err => {
                this.notificationService.addNotify({
                  title: 'Alerta',
                  msg: 'Por favor valide los datos ',
                  type: 'error'
                });
              }
            );
          } else {
            if (resp.configuracion === 0) {
              this.router.navigate(['config/equipos']);
            }
            this.notificationService.addNotify({
              title: 'Alerta',
              msg: resp.message,
              type: 'error'
            });
          }
        });
    } else {
      // console.log(this.item)
      this.cactualizarItem(this.item);
    }
  }
  cargardatos() {
    document.getElementById('input_busqueda')['value'] = '';
    const hoy = moment(new Date());
    this.emails1 = [];
    this.emails2 = [];
    this.equipoService.getById(this.id).subscribe(
      (value: any) => {
        console.log(value);
        this.item = value.data;
        this.item.fingreso = moment(this.item.fingreso).format('YYYY-MM-DD');

        this.item.fingreso = moment(this.item.fingreso).format('YYYY-MM-DD');

        this.item.variables.forEach((element, index) => {
          this.item.variables[index].vigencia = hoy.diff(
            element['proxcalibracion'],
            'days'
          );
        });

        if (this.item.calibraciones.length > 0) {
          if (this.item.calibraciones[0].emails1.length > 0) {
            this.item.calibraciones[0].emails1.forEach(element => {
              if (element !== null) {
                this.emails1.push(element);
              }
            });
          }
          if (this.item.mantenimientos[0].emails2.length > 0) {
            this.item.mantenimientos[0].emails2.forEach(element => {
              if (element !== null) {
                this.emails2.push(element);
              }
            });
          }
          this.formconfiguraciones.setValue({
            email: this.item.calibraciones[0].email,
            emails1: '',
            Rcada: this.item.calibraciones[0].Rcada,
            tiempo: this.item.calibraciones[0].tiempo,
            email2: this.item.mantenimientos[0].email,
            emails2: '',
            Rcada2: this.item.mantenimientos[0].Rcada,
            tiempo2: this.item.mantenimientos[0].tiempo,
            avisarCorreo: this.item.avisarCorreo
          });
          // console.log(this.formconfiguraciones.value);
        } else {
          this.modal_config = true;
          this.formconfiguraciones.setValue({
            email: '',
            emails1: '',
            Rcada: '',
            tiempo: 0,
            email2: '',
            emails2: '',
            Rcada2: '',
            tiempo2: 0,
            avisarCorreo: this.item.avisarCorreo
          });
        }
        // this.calculaVaribleMantenimiento();
        this.ordenarEventos(this.item);
        this.preloader = false;
        setTimeout(() => {
          this.calculaVaribleMantenimiento();
        }, 1000);
      },
      err => {
        this.notificationService.addNotify({
          title: 'Alerta',
          msg: 'Por favor valide los datos ',
          type: 'error'
        });
      }
    );
  }
  ordenarEventos(item) {
    this.item.mantenimientos = item.mantenimientos.sort();
  }
  celiminarItem(item) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea eliminar el equipo?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.value) {
        this.eliminarItem(item);
        this.actualizarItem(item);
      }
    });
  }
  eliminarItem(item) {
    this.equipoService.delete(item._id, item).subscribe(
      (value: any) => {
        this.notificationService.addNotify({
          title: 'Alerta',
          msg: 'Equipo eliminado con exito',
          type: 'success'
        });
        item.edit = false;
        let index = this.items.findIndex(x => x._id == item._id);
        this.items.splice(index, 1);
      },
      err => {
        this.notificationService.addNotify({
          title: 'Alerta',
          msg: 'Por favor valide los datos ',
          type: 'error'
        });
      }
    );
  }
  cactualizarItem(item) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea actualizar el equipo?',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'No'
    }).then((result: any) => {
      if (result.value) {
        this.actualizarItem(item);
      } else {
        this.cargardatos();
      }
    });
  }
  actualizarItem(item) {
    if (item !== undefined && item._id != undefined) {
      // item.fingreso = null;
      this.equipoService.update(item).subscribe(
        (value: any) => {
          this.notificationService.addNotify({
            title: 'Alerta',
            msg: 'Equipo actualizado con exito',
            type: 'success'
          });
          item.edit = false;
          this.desplegable = false;
          this.metodo('cancel', 0);
          this.cargardatos();
        },
        err => {
          this.notificationService.addNotify({
            title: 'Alerta',
            msg: 'Por favor valide los datos ',
            type: 'error'
          });
        }
      );
    }
  }
  onSuccessItem(
    item: FileItem,
    response: any,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    let file = JSON.parse(response).file;
    this.item.imagen = file.filename;
    this.item.imagenoriginal = file.filename;
    this.actualizarItem(this.item);
    this.compeseurlimage();
    this.editarImagen = false;
    // console.log(this.imagenes)
  }
  onSuccessItemEquipo(
    item: FileItem,
    response: any,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    let file = JSON.parse(response).file;
    if (this.item.archivos == undefined) {
      this.item.archivos = [];
    }
    this.item.archivos.push(file);
    // console.log(this.imagenes)
  }
  openedit(equipo) {
    this.openMyModal('effect-3');
    this.item = equipo;
    this.item.fingreso = moment(this.item.fingreso).format('YYYY-MM-DD');
  }
  calcularproximafecha(variable) {
    let valor = variable.tipofrecuencia;
    if (valor == 'Dias') {
      return moment(variable.ultcalibracion).add(
        variable.frecalibracion,
        'days'
      );
    } else if (valor == 'Semanas') {
      return moment(variable.ultcalibracion).add(
        variable.frecalibracion,
        'week'
      );
    } else if (valor == 'Meses') {
      return moment(variable.ultcalibracion).add(
        variable.frecalibracion,
        'months'
      );
    } else if (valor == 'Año') {
      return moment(variable.ultcalibracion).add(
        variable.frecalibracion,
        'years'
      );
    }
  }
  guardarReparacion(event) {
    console.log(event);

    if (this.eventoedit == undefined && event != undefined) {
      if (this.item.reparaciones == undefined) {
        this.item.reparaciones = [];
      }
      this.item.reparaciones.push(event);
      this.cactualizarItem(this.item);
    }
    this.agregarReparacion = false;
    this.newRepair = false;
    this.cactualizarItem(this.item);
  }
  editdano(index) {
    this.agregarReparacion = true;
    this.eventoedit = this.item.reparaciones[index];
    this.ver_registros = 0;
  }
  celiminardano(index) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea eliminar el registro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.value) {
        this.item.reparaciones.splice(index, 1);
      }
    });
  }
  eliminararchivo(index) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea eliminar el registro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then((result: any) => {
      if (result.value) {
        this.item.archivos.splice(index, 1);
      }
    });
  }
  cancelar() {
    this.router.navigate(['config/equipos']);
  }
  CropMe() {
    this.angularCropper.exportCanvas();
  }
  zoomIn() {
    this.angularCropper.cropper.zoom(0.1);
  }
  zoomOut() {
    this.angularCropper.cropper.zoom(-0.1);
  }
  rotate() {
    this.angularCropper.cropper.rotate(90);
  }
  move(value) {
    if (value > 0) {
      this.angularCropper.cropper.move(value, 0);
    } else {
      this.angularCropper.cropper.move(value, 0);
    }
  }
  moveUp(value) {
    this.angularCropper.cropper.move(0, value);
  }

  resultImageFun(event: ImageCropperResult) {
    let urlCreator = window.URL;
    this.item.imagen = this.angularCropper.cropper
      .getCroppedCanvas({
        fillColor: '#fff'
      })
      .toDataURL('image/jpeg');
    this.item.firmaWidth = 200;
    this.item.firmaHeight = 200;
    this.editarImagen = false;
  }
  cropimage() {
    this.imageurl =
      this.apiurl + 'upload/files_client/' + this.item.imagenoriginal;

    this.editarImagen = !this.editarImagen;
  }
  compeseurlimage() {
    if (
      this.item == undefined ||
      this.item.imagen == '' ||
      this.item.imagen == undefined
    ) {
      return 'assets/images/200empty.png';
    } else if (this.item.imagen.includes('data:image/jpeg')) {
      return this.item.imagen;
    }
    return this.apiurl + 'upload/files_client/' + this.item.imagen;
  }
  checkstatus(event: any) {
    if (event.blob === undefined) {
      return;
    }
    // this.resultResult = event.blob;
    let urlCreator = window.URL;
    this.item.image = this.sanitizer.bypassSecurityTrustUrl(
      urlCreator.createObjectURL(new Blob(event.blob))
    );
  }
  eliminarEquipo(item) {
    this.equipoService.delete(item._id, item).subscribe(
      (value: any) => {
        this.notificationService.addNotify({
          title: 'Alerta',
          msg: 'Equipo eliminado con exito',
          type: 'success'
        });
        this.router.navigate(['config/equipos']);
      },
      err => {
        this.notificationService.addNotify({
          title: 'Alerta',
          msg: 'Por favor valide los datos ',
          type: 'error'
        });
      }
    );
  }
  metodo(evento, index): void {
    this.newRepair = false;
    switch (evento) {
      case 'ver-registros':
        this.ver_registros = 1;
        this.agregarReparacion = true;
        this.eventoedit = this.item.reparaciones[index];
        break;
      case 'cancel':
        this.editItem = false;
        break;
      case 'edit':
        this.editItem = true;
        this.cactualizarItem(this.item);
        break;
      case 'delete':
        swal({
          title: 'Alerta!',
          text: 'Realmente desea eliminar el registro?',
          showCancelButton: true,
          confirmButtonText: 'Si, eliminar!',
          cancelButtonText: 'No'
        }).then((result: any) => {
          if (result.value) {
            this.eliminarEquipo(this.item);
          }
        });
        break;
    }
  }
  metodo2(evento): void {
    switch (evento) {
      case 'new-event':
        this.ver_registros = 2;
        this.agregarReparacion = false;
        this.eventoedit = null;
        break;
      case 'cancel':
        this.editItem = false;
        break;
    }
  }
  activateNewEvent() {
    this.ver_registros = 2;
  }
  calculaVaribleMantenimiento(): void {
    const variables = [...this.item.variables];
    const reparaciones = [...this.item.reparaciones];
    const cantidadDias =
      this.formconfiguraciones.value.Rcada *
      parseInt(this.formconfiguraciones.value.tiempo);
    const cantidadDias2 =
      this.formconfiguraciones.value.Rcada2 *
      parseInt(this.formconfiguraciones.value.tiempo2);
    // tslint:disable-next-line: forin
    for (const i in variables) {
      // console.log('Proxima calibracion', variables[i].proxcalibracion);
      // console.log('Substrac', moment(variables[i].proxcalibracion).subtract(cantidadDias, 'days').format());
      variables[i].fechaAviso = moment(variables[i].proxcalibracion)
        .subtract(cantidadDias, 'days')
        .format();
    }
    this.item.variables = [...variables];
    // tslint:disable-next-line: forin
    for (const i in reparaciones) {
      reparaciones[i].fechaAviso = moment(reparaciones[i].fechaNovedad)
        .subtract(cantidadDias2, 'days')
        .format();
    }
    this.item.variables = [...variables];
    this.item.reparaciones = [...reparaciones];
  }
  guardarConfig() {
    this.desplegable = false;
    const Calibraciones = {
      email: this.formconfiguraciones.value.email,
      Rcada: this.formconfiguraciones.value.Rcada,
      emails1: [],
      tiempo: parseInt(this.formconfiguraciones.value.tiempo)
    };
    const Mantenimientos = {
      email: this.formconfiguraciones.value.email2,
      emails2: [],
      Rcada: this.formconfiguraciones.value.Rcada2,
      tiempo: parseInt(this.formconfiguraciones.value.tiempo2)
    };

    if (this.emails1.length > 0) {
      this.emails1.forEach(element => {
        Calibraciones.emails1.push(element);
      });
    }
    if (this.emails2.length > 0) {
      this.emails2.forEach(element => {
        Mantenimientos.emails2.push(element);
      });
    }
    // return
    this.item.calibraciones = Calibraciones;
    this.item.mantenimientos = Mantenimientos;
    this.calculaVaribleMantenimiento();
    this.item.avisarCorreo = this.formconfiguraciones.value.avisarCorreo;
    this.cactualizarItem(this.item);
    this.closeModal('alertas');
  }
  calcularEventos() {
    // if (this.formaEventos.valid) {
    let clasificacion;
    if (this.formaEventos.value.clasificacion === 'Otro') {
      clasificacion = document.getElementById('clasificacion-id')['value'];
    } else {
      clasificacion = this.formaEventos.value.clasificacion;
    }
    const incremento =
      parseInt(this.formaEventos.value.intervalo) *
      parseInt(this.formaEventos.value.repetirCada);
    const intervalo = parseInt(this.formaEventos.value.intervalo);

    const fechaInicio = moment(this.formaEventos.value.fechaInicio);
    const fechaFin = moment(this.formaEventos.value.fechaFin);
    const fechaDif = fechaFin.diff(fechaInicio, 'days');
    let dayInit = new Date(this.formaEventos.value.fechaInicio);
    const arrayIntervalos = Array();
    let fechaNovedadNew;
    let fecha = '';
    if (this.item.avisarCorreo) {
      fecha = moment(new Date()).format('DD-MM-YYYY');
    }
    //forma while
    let i: number = 0;
    do {
      // console.log(i);
      if (i <= 0) {
        var dayInit3 = new Date(dayInit.setDate(dayInit.getDate() + 1));
        dayInit4 = moment(dayInit3);
        arrayIntervalos.push({
          envioCorreo: false,
          fechaAviso: fecha,
          archivo: [],
          clasificacion: clasificacion,
          fechaNovedad: moment(dayInit4).format(),
          observaciones: []
        });
      } else if (this.formaEventos.value.repetirCada == 'dia') {
        dayInit4 = moment(dayInit4).add(intervalo, 'd');
        arrayIntervalos.push({
          envioCorreo: false,
          fechaAviso: fecha,
          archivo: [],
          clasificacion: clasificacion,
          fechaNovedad: moment(dayInit4).format(),
          observaciones: []
        });
      } else if (this.formaEventos.value.repetirCada == 'semana') {
        var dayInit4 = moment(dayInit4).add(intervalo, 'w');
        arrayIntervalos.push({
          envioCorreo: false,
          fechaAviso: fecha,
          archivo: [],
          clasificacion: clasificacion,
          fechaNovedad: moment(dayInit4).format(),
          observaciones: []
        });
      } else if (this.formaEventos.value.repetirCada == 'mes') {
        dayInit4 = moment(dayInit4).add(intervalo, 'M');
        arrayIntervalos.push({
          envioCorreo: false,
          fechaAviso: fecha,
          archivo: [],
          clasificacion: clasificacion,
          fechaNovedad: moment(dayInit4).format(),
          observaciones: []
        });
      } else if (this.formaEventos.value.repetirCada == 'ano') {
        dayInit4 = moment(dayInit4).add(intervalo, 'y');
        arrayIntervalos.push({
          envioCorreo: false,
          fechaAviso: fecha,
          archivo: [],
          clasificacion: clasificacion,
          fechaNovedad: moment(dayInit4).format(),
          observaciones: []
        });
      }
      var fechaDif2 = fechaFin.diff(dayInit4, 'days');
      // console.log(moment(dayInit4).format());
      // console.log("la fecha dif es igual a "+ fechaDif2);

      if (fechaDif2 >= 0) {
        console.log(
          `fecha ciclo ${moment(dayInit4).format()} es menor igual a ${moment(
            fechaFin
          ).format()}  `
        );
      } else {
        console.log(
          `fecha ciclo ${moment(dayInit4).format()} es mayor igual a ${moment(
            fechaFin
          ).format()} se debe cerrar ciclo en la iteracion ${i} `
        );
        arrayIntervalos.pop();
      }
      i++;
    } while (fechaDif2 >= 0);
    arrayIntervalos.forEach(element => {
      this.item.reparaciones.push(element);
    });
    this.closeModal('programar-eventos');
    this.guardarConfig();
  }

  openvariables(idexVar) {
    this.ViewVariables = true;
    this.openModal('modalVariables');
  }
  endAction($event) {
    if ($event === 'close') {
      this.closeModal('modalVariables');
    } else {
      this.cargardatos();
      this.closeModal('modalVariables');
    }
    this.ViewVariables = false;
  }
  buscadorMantenimientos(event) {
    const texto = event.target.value.toLowerCase();
    const array = [];
    if (texto.length === 0) {
      this.cargardatos();
    } else {
      for (let reparacion of this.item.reparaciones) {
        const fecha = reparacion.fechaNovedad.toLowerCase();
        const descripcion = reparacion.descripcion.toLowerCase();
        const clasificacion = reparacion.clasificacion.toLowerCase();
        if (
          clasificacion.indexOf(texto) !== -1 ||
          descripcion.indexOf(texto) !== -1 ||
          fecha.indexOf(texto) !== -1
        ) {
          array.push(reparacion);
        }
      }
      this.item.reparaciones = array;
    }
  }
  AgregarImagen(event, editorImg) {
    this.editorImg = '';
    document.querySelector('#' + event).classList.add('md-show');
    this.editorImg = editorImg;
  }
  seleccioareditor(editor) {
    switch (editor) {
      case 'myckeditorInfoAdicional':
        return this.myckeditorInfoAdicional;
      case 'myckeditorinfoAdicionalHeader':
        return this.myckeditorinfoAdicionalHeader;
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
    }).then(result => {
      const index = this.imagenes.indexOf(this.imagenSel);
      if (index > -1) {
        this.imagenes.splice(index, 1);
      }
    });
  }
  insertarImagen(imagen, event) {
    // console.log(this.editorImg)
    const urlImg =
      this.apiurl +
      'upload/files_client/' +
      imagen.filename +
      '?name=' +
      imagen.originalname;
    const editoSel = this.seleccioareditor(this.editorImg);
    editoSel.instance.insertHtml('<img src="' + urlImg + '" >');
    this.notificationService.addNotify({
      title: 'Alerta',
      msg: 'Imagen insertada con exito',
      type: 'success'
    });
    this.closeModal('effect');
  }
}



