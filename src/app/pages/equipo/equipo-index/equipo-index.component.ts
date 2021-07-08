import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { animate, style, transition, trigger } from '@angular/animations';
import { EquipoService } from '../../../services/equipo/equipo.service';
import swal from 'sweetalert2';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { Equipo } from '../../../models/equipo';
import * as moment from 'moment';
import { ConfigAlertaEquiposService } from '../../../services/equipo/config-alerta-equipos.service';
import { ConfigEquiposAlertas } from '../../../models/ConfigEquiposAlertas';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
import { InfoAdicionalEquiposService } from '../../../services/infoAdicional-equipos/info-adicional-equipos.service';

@Component({
  selector: 'app-equipo-index',
  templateUrl: './equipo-index.component.html',
  styleUrls: ['./equipo-index.component.scss',
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
export class EquipoIndexComponent implements OnInit {
  @ViewChild('myckeditorInfoAdicional') myckeditorInfoAdicional: any;
  @ViewChild('myckeditorinfoAdicionalHeader') myckeditorinfoAdicionalHeader: any;
  form: FormGroup;
  item: any;
  items: any;
  columns: any[];
  user: any;
  ckeconfig: any;
  configEquiposAlertas: ConfigEquiposAlertas;
  imagenSel: any;
  editorImg: any;
  configuracionesGlobales:any;
  emails1: any[] = [];
  emails2: any[] = [];
  clasificaciones: any[] = [];
  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,

  });
  uploaderequipo: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,

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
  apiurl: any;
  eventoedit: any;
  cabeceras = [
    'Nombre',
    'Fabricante',
    'Código',
    'N° Serie',
    'Fecha ingreso',
    'Software/Firmware',
    'Ubicación'
  ];
  datoCopypaste = [];
  displayedColumns: string[];
  formconfiguraciones: FormGroup;
  formEstructuras: FormGroup;
  _idConfiguracion: string;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  campos = {
    activaN1: false,
    activaN2: false,
    activaN3: false,
    activaN4: false,
    activaN5: false
  };
  infoAdicional: any = [];
  imagenes: any = [];
  constructor(private notificationService: NotificationService,
              private formBuilder: FormBuilder,
              private equipoService: EquipoService,
              private configuracionesEquipoService: ConfigAlertaEquiposService,
              private rolesPermisosServices: RolesPermisosService,
              private InfoAdicionalEquiposService: InfoAdicionalEquiposService
    ) {
      this.ckeconfig = {
        allowedContent: false,
        extraPlugins: 'divarea',
      };
      this.columns = [
      { name: 'Nombre' },
      { name: 'Metodo', prop: 'tecnica_analitica' },
      { name: 'Tecnica analítica', prop: 'tecnica_analitica' },
      { name: 'Unidad', prop: 'unidad' },
      { name: 'valor_unit', prop: 'valor_unit' },
      { name: 'descripcion', prop: 'descripcion' }
    ];
      this.user = JSON.parse(localStorage.getItem('userInfo'));
      this.Permisos = new Permisos();
  }
  copypaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');
    this.datoCopypaste = [];
    this.displayedColumns = row_data[0].split('\t');
    row_data.forEach((row_data) => {
      this.datoCopypaste.push(row_data.split('\t'));
    });
  }
  formMasivo() {
    let contador = 0;
    const Calibraciones = {
      email: this.configEquiposAlertas.email,
      Rcada: this.configEquiposAlertas.Rcada,
      tiempo: this.configEquiposAlertas.tiempo
    }
    const Mantenimientos = {
      email: this.configEquiposAlertas.email2,
      Rcada: this.configEquiposAlertas.Rcada2,
      tiempo: this.configEquiposAlertas.tiempo2
    }
    this.datoCopypaste.forEach((element, index) => {
      const equipo = {
        tercero: this.user.tercero._id,
        nombre: element[0],
        fabricante: element[1],
        codigo: element[2],
        nserie: element[3],
        estado: 'Funcional',
        fingreso: element[4],
        softwarefim: element[5],
        ubicacion: element[6],
        calibraciones: Calibraciones,
        mantenimientos: Mantenimientos,
        avisarCorreo: this.configEquiposAlertas.avisarCorreo,
        infoAdicional: this.infoAdicional['infoAdicional'],
        infoAdicionalHeader: this.infoAdicional['infoAdicionalHeader']
      };
      this.equipoService.add(equipo).subscribe((value: any) => {
        contador = contador + 1;
        this.recargaMethodo(contador)
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Equipo almacenado con exito', type: 'success' });
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    });
  }
  recargaMethodo(cont: number) {
    if (this.datoCopypaste.length === cont) {
      this.cargardatos();
      this.closeModal('equipos-masivos');
      this.datoCopypaste = [];
      this.displayedColumns = [];
    }
  }
  editar(id) {
    const campos = [];
    this.datoCopypaste[id].forEach((element, index) => {
      campos.push(document.getElementById('campo-' + index + '-' + id)['value']);
    });
    this.datoCopypaste.splice(id, 1);
    this.datoCopypaste.push(campos);
  }
  eliminar(id) {
    this.datoCopypaste.splice(id, 1);
  }
  openModal(element) {
    document.getElementById(element).classList.add('md-show')
  }
  closeModal(element) {
    document.getElementById(element).classList.remove('md-show');
  }
  ngOnInit() {
    this.cargardatos();
    this.cargarConfig();
    this.cargaInfoAdicional();
    this.item = new Equipo();
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.Equipos[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
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
    this.formEstructuras = new FormGroup({
      tercero: new FormControl(false),
      infoAdicional: new FormControl(false),
      infoAdicionalHeader: new FormControl(false),
      _id: new FormControl(null)
    })
    this.formconfiguraciones = new FormGroup({
      email: new FormControl(null),
      emails1: new FormControl(null),
      Rcada: new FormControl(null),
      tiempo: new FormControl(null),
      email2: new FormControl(null),
      emails2: new FormControl(null),
      Rcada2: new FormControl(null),
      tiempo2: new FormControl(null),
      avisarCorreo: new FormControl(false),
      nombre1: new FormControl(''),
      activaN1: new FormControl(false),
      nombre2: new FormControl(''),
      activaN2: new FormControl(false),
      nombre3: new FormControl(''),
      activaN3: new FormControl(false),
      nombre4: new FormControl(''),
      activaN4: new FormControl(false),
      nombre5: new FormControl(''),
      activaN5: new FormControl(false),
      clasificaciones: new FormControl(null),
      _id: new FormControl(null)
    });

    this.uploader.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        name: item.file.name,
        type: item.file.type
      };
    };
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.onSuccessItem(item, response, status, headers);
    };
    this.uploaderequipo.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        name: item.file.name,
        type: item.file.type
      };
    };
    this.uploaderequipo.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploaderequipo.onSuccessItem = (item, response, status, headers) => {
      this.onSuccessItemEquipo(item, response, status, headers)
    };
    this.apiurl = environment.apiUrl;
    this.uploaderImagenEditor.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploaderImagenEditor.onSuccessItem = (item, response, status, headers) => {
      this.onSuccessItemImagenEditor(item, response, status, headers);
    };
  }
  onSuccessItemImagenEditor(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
      const file = JSON.parse(response).file;
      this.imagenes.push(file);
  }
  cargaInfoAdicional() {
    this.InfoAdicionalEquiposService.get().subscribe( (resp: any) => {
      console.log(resp)
      if (resp.success) {
        if (resp.InfoAdicional.length > 0) {
          this.infoAdicional = resp.InfoAdicional[0];
          this.formEstructuras.setValue({
            tercero : this.infoAdicional.tercero,
            infoAdicional : this.infoAdicional.infoAdicional,
            infoAdicionalHeader : this.infoAdicional.infoAdicionalHeader,
            _id : this.infoAdicional._id
          });
        }
      }
    });
  }
  definirEstructuras(tipo) {
    try {
      const estructura = {
        tipo : tipo,
        html : ''
      };
      if ( tipo === 'head') {
        estructura.html = this.formEstructuras.value.infoAdicionalHeader;
      } else {
        estructura.html = this.formEstructuras.value.infoAdicional;
      }

      this.equipoService.updateEstructuras(estructura).subscribe( (resp: any) => {
        this.notificationService.addNotify({ title: 'Estructuras - Información Adicional', msg: resp.message, type: 'success' });
        this.closeModal('estructuras');
      });
    } catch (error) {
      this.notificationService.addNotify({ title: 'Estructuras - Información Adicional', msg: error, type: 'error' });
    }
  }
  guardar_editarEstructuras() {
    if ( this.infoAdicional._id !== null) {
        const infoAdicional = {
          infoAdicionalHeader: this.formEstructuras.value.infoAdicionalHeader,
          infoAdicional: this.formEstructuras.value.infoAdicional,
          tercero: this.user.tercero._id,
          _id: this.infoAdicional._id
        };
        this.InfoAdicionalEquiposService.update(infoAdicional).subscribe( (resp:any) => {
          if (resp.success) {
            this.closeModal('estructuras')
            return this.notificationService.addNotify({ title: 'Infomación Adicional', msg: resp.message, type: 'success' });
          } else {
            this.closeModal('estructuras')
            return this.notificationService.addNotify({ title: 'Infomación Adicional', msg: resp.message, type: 'error' });
          }
        });
      } else  {
        const infoAdicional = {
          infoAdicionalHeader: this.formconfiguraciones.value.infoAdicionalHeader,
          infoAdicional: this.formconfiguraciones.value.infoAdicional,
          tercero: this.user.tercero._id
        };
        this.InfoAdicionalEquiposService.add(infoAdicional).subscribe( (resp:any) => {
          if (resp.success) {
            this.closeModal('estructuras')
            return this.notificationService.addNotify({ title: 'Infomación Adicional', msg: resp.message, type: 'success' });
          } else {
            this.closeModal('estructuras')
            return this.notificationService.addNotify({ title: 'Infomación Adicional', msg: resp.message, type: 'error' });
          }
        });
      }
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe((resp: any) => {
        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.Equipos[0];
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }
      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  openMyModal(event) {
    this.item = new Equipo();
    document.querySelector('#' + event).classList.add('md-show');
  }
  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  closeMyModalbtn(event) {
    ((event.target.parentElement.parentElement.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  guardar(event) {

    if (this.item._id === undefined) {
      this.item.tercero = this.user.tercero._id;
      this.equipoService.add(this.item).subscribe((value) => {
        this.closeMyModalbtn(event);
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
    this.equipoService.get(1).subscribe((value: any) => {
      this.items = value.data;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  /**
   * Configuraciones De Aletas Equipos
   */
  cargarConfig() {
    this.configuracionesEquipoService.getconfiguracionEquipos().subscribe((resp: any) => {
      if (resp.success) {
        this._idConfiguracion = resp.configuracion[0]._id;
        this.configuracionesGlobales = resp.configuracion[0];
        this.emails1 = this.configuracionesGlobales['emails1']
        this.emails2 = this.configuracionesGlobales['emails2']
        this.clasificaciones = this.configuracionesGlobales['clasificaciones']
        console.log(this.configuracionesGlobales)
        this.llenadoForm(resp.configuracion[0]);
        this.configEquiposAlertas = resp.configuracion[0];
        this.campos = {
          activaN1: this.configEquiposAlertas.activaN1,
          activaN2: this.configEquiposAlertas.activaN2,
          activaN3: this.configEquiposAlertas.activaN3,
          activaN4: this.configEquiposAlertas.activaN4,
          activaN5: this.configEquiposAlertas.activaN5
        };
      } else {
        if (resp.configuraciones === 0) {
          this._idConfiguracion = '';
          return this.notificationService.addNotify({ title: 'Configuración de Alertas', msg: resp.message, type: 'info' });
        } else {
          return this.notificationService.addNotify({ title: 'Configuración de Alertas', msg: resp.message, type: 'error' });
        }
      }
    });
  }
  deletearr(email, tipo){
    console.log(email, tipo)
    try {
      switch (tipo) {
        case 'emails1':
          const m1=[];
          this.emails1.forEach(element => {
            if (element != email) {
              m1.push(element)
            }
          });
          this.emails1 = [];
          this.emails1 = m1;
          break;
        case 'emails2':
          const m2 = [];
          this.emails2.forEach(element => {
            if (element != email) {
              m2.push(element)
            }
          });
          this.emails2 = [];
          this.emails2 = m2;
          break;
        case 'clasificaciones':
          const el = [];
          this.clasificaciones.forEach(element => {
            if (element != email) {
              el.push(element)
            }
          });
          this.clasificaciones = [];
          this.clasificaciones = el;
          break;
      }
    } catch (error) {
      alert(error)
    }
    console.log(this.clasificaciones)
  }
  addemails(email, tipo) {
    try {
      switch (tipo) {
        case 'emails1':
          this.emails1.push(email);
          document.getElementById('idemails1')['value']='';
          break;
        case 'emails2':
          this.emails2.push(email);
          document.getElementById('idemails2')['value']='';
          break;
        case 'clasificaciones':
          this.clasificaciones.push(email);
          document.getElementById('idclasificaciones')['value']='';
          break;
      }
    } catch (error) {
      alert(error)
    }
  }
  deleteConfig(id) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea eliminar el equipo?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.configuracionesEquipoService.deleteconfiguracionEquipos(id).subscribe((resp: any) => {
          if (resp.success) {
            this.closeModal('alertas');
            this.formconfiguraciones.setValue({
              email: '',
              Rcada: '',
              tiempo: '',
              email2: '',
              emails2: '',
              Rcada2: '',
              tiempo2: '',
              avisarCorreo: false,
              _id: null
            });
            this.cargarConfig();
            return this.notificationService.addNotify({ title: 'Configuración de Alertas', msg: resp.message, type: 'success' });
          } else {
            return this.notificationService.addNotify({ title: 'Configuración de Alertas', msg: resp.message, type: 'error' });
          }
        });
      }
    }
    );
  }

  guardarConfig() {
    const config = {
      avisarCorreo: this.formconfiguraciones.value.avisarCorreo,
      email: this.formconfiguraciones.value.email,
      emails1: [],
      Rcada: this.formconfiguraciones.value.Rcada,
      tiempo: parseFloat(this.formconfiguraciones.value.tiempo),
      email2: this.formconfiguraciones.value.email2,
      emails2: [],
      Rcada2: this.formconfiguraciones.value.Rcada2,
      tiempo2: parseFloat(this.formconfiguraciones.value.tiempo2),
      nombre1: this.formconfiguraciones.value.nombre1,
      activaN1: this.formconfiguraciones.value.activaN1,
      nombre2: this.formconfiguraciones.value.nombre2,
      activaN2: this.formconfiguraciones.value.activaN2,
      nombre3: this.formconfiguraciones.value.nombre3,
      activaN3: this.formconfiguraciones.value.activaN3,
      nombre4: this.formconfiguraciones.value.nombre4,
      activaN4: this.formconfiguraciones.value.activaN4,
      nombre5: this.formconfiguraciones.value.nombre5,
      activaN5: this.formconfiguraciones.value.activaN5,
      clasificaciones: [],
      tercero: this.user.tercero._id,
      _id: this.formconfiguraciones.value._id
    };
    if (this.emails1.length > 0) {
      this.emails1.forEach(element => {
          config.emails1.push(element)
      });
    }
    if (this.emails2.length > 0) {
      this.emails2.forEach(element => {
          config.emails2.push(element)
      });
    }
    if (this.clasificaciones.length > 0) {
      this.clasificaciones.forEach(element => {
          config.clasificaciones.push(element)
      });
    }
    if (this.formconfiguraciones.value._id === null) {
      this.configuracionesEquipoService.addconfiguracionEquipos(config).subscribe((resp: any) => {
        console.log(resp);
        if (resp.success) {
          this._idConfiguracion = resp.configuracionShared._id;
          this.closeModal('alertas')
          return this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
        } else {
          return this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'error' });
        }
      });
    } else {
      this.configuracionesEquipoService.editconfiguracionEquipos(config).subscribe((resp: any) => {
        console.log(resp);
        if (resp.success) {
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
          this.closeModal('alertas')
        }
      });
    }
  }
  llenadoForm(config) {
    this.formconfiguraciones.setValue({
      email: config.email,
      emails1: "",
      Rcada: config.Rcada,
      tiempo: config.tiempo,
      email2: config.email2,
      emails2: "",
      Rcada2: config.Rcada2,
      tiempo2: config.tiempo2,
      avisarCorreo: config.avisarCorreo,
      nombre1: config.nombre1,
      activaN1: config.activaN1,
      nombre2: config.nombre2,
      activaN2: config.activaN2,
      nombre3: config.nombre3,
      activaN3: config.activaN3,
      nombre4: config.nombre4,
      activaN4: config.activaN4,
      nombre5: config.nombre5,
      activaN5: config.activaN5,
      clasificaciones: "",
      _id: config._id,
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
      const index = this.items.findIndex((x) => x._id === item._id);
      this.items.splice(index, 1);
      this.cargardatos();
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cactualizarItem(item) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea actualizar el equipos?',
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

    if (item !== undefined && item._id !== undefined) {
      this.equipoService.update(item).subscribe((value) => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Equipo actualizado con exito', type: 'success' });
        item.edit = false;

      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }

  }
  onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    const file = JSON.parse(response).file;
    this.item.imagen = file.filename;
    this.actualizarItem(this.item);
  }
  onSuccessItemEquipo(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    const file = JSON.parse(response).file;
    if (this.item.archivos === undefined) {
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
    const valor = variable.tipofrecuencia;
    if (valor === 'Dias') {
      return moment(variable.ultcalibracion).add(variable.frecalibracion, 'days');
    } else if (valor === 'Semanas') {
      return moment(variable.ultcalibracion).add(variable.frecalibracion, 'week');
    } else if (valor === 'Meses') {
      return moment(variable.ultcalibracion).add(variable.frecalibracion, 'months');
    } else if (valor === 'Año') {
      return moment(variable.ultcalibracion).add(variable.frecalibracion, 'years');
    }
  }
  guardarReparacion(event) {

    if (event !== undefined) {
      if (this.item.reparaciones === undefined) {
        this.item.reparaciones = [];
      } this.item.reparaciones.push(event);
    }
    this.agregarReparacion = false;

  }
  editdano(index) {
    this.agregarReparacion = true;
    this.eventoedit = this.item.reparaciones[index];
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
  eliminararchivo(index) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea eliminar el registro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.item.archivos.splice(index, 1);
      }
    }
    );
  }
  compeseurlimage(item) {
    if (item === undefined || item.imagen === '' || item.imagen === undefined) {
      return 'assets/images/200empty.png';
    } else if (item.imagen.includes('data:image/jpeg')) {
      return item.imagen;
    }
    return this.apiurl + 'upload/files_client/' + item.imagen;


  }
  buscarEquipos(event) {
    this.equipoService.busquedaEquiupos(event.target.value).subscribe((resp: any) => {
      if (resp.success) {
        this.item = new Equipo();
        this.items = resp.equipos;
      } else {
        return;
      }
    });
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
    }).then((result) => {
      const index = this.imagenes.indexOf(this.imagenSel);
      if (index > -1) {
        this.imagenes.splice(index, 1);
      }
    });
  }
  insertarImagen(imagen, event) {
    const urlImg = this.apiurl + 'upload/files_client/' + imagen.filename + '?name=' + imagen.originalname;
    const editoSel = this.seleccioareditor(this.editorImg);
    editoSel.instance.insertHtml('<img src="' + urlImg + '" >');
    this.notificationService.addNotify({ title: 'Alerta', msg: 'Imagen insertada con exito', type: 'success' });
    this.closeModal('effect');
  }
  edicionGeneral(){
    const parametros = {
      cant_reparaciones : this.formconfiguraciones.value.Rcada * parseInt(this.formconfiguraciones.value.tiempo),
      cant_variables : this.formconfiguraciones.value.Rcada2 * parseInt(this.formconfiguraciones.value.tiempo2)
    }
    this.configuracionesEquipoService.updateMantenimientosReparaciones(parametros).subscribe( (resp: any) => {
      console.log(resp)
      if (resp.success) {
        this.guardarConfig();
        this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
      }else {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Error al procesar la acción', type: 'error' });
      }
    });
  }
}
