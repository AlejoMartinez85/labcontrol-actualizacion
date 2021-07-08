import { Component, OnInit,VERSION, ViewChild } from '@angular/core';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from '../../../shared/notification';
import { Ensayo } from '../../../models/ensayo';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Muestra } from '../../../models/muestra';
import swal from 'sweetalert2';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { IOption } from 'ng-select';
import { MuestraService } from '../../../services/muestra/muestra.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { EnsayoParametro } from '../../../models/ensayo_parametro';
import { templateSourceUrl } from '@angular/compiler';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Reporte } from '../../../models/reporte';
import { environment } from '../../../../environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
moment.locale('es-CO');

@Component({
  selector: 'app-recepcion-ensayo',
  templateUrl: './recepcion-ensayo.component.html',
  styleUrls: ['./recepcion-ensayo.component.scss',
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
export class RecepcionEnsayoComponent implements OnInit {
  columnsMuestras = []
  desde = 0;
  estado = false;
  continue = true;
  /*ensayo */
  ensayo: any;
  muestraAdd: Muestra;
  form: FormGroup;
  parametros: any;
  parametronew: any;
  muestras: any;
  muestrasel: any;
  ensayos: any;
  columns: any[];
  clientes: any[];
  @ViewChild('modaladd') modaladd: any;

  tabactive: string;
  indicadores: any;
  pagos: any;
  user: any;
  tipocomentario: any;
  tabactivesol: string;
  @ViewChild('tabsetadmin') tabset: any;

  archivosMuestras = [];
  imagePath = './assets/images/unnamed.png';
  apiurl: string;
  formaMuestras: FormGroup;

  muestraFinal = {
    imagen_perfil: '',
    codigo: '',
    descripcion: '',
    fecha_ingreso: Date,
    observaciones: ''
  };
  cliente = [];
  Muestras = [];
  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
  });
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  constructor(private notificationService: NotificationService,
              private ensayoservice: EnsayoService,
              private formBuilder: FormBuilder,
              private parametroService: ParametroService,
              private clienteService: ClienteService,
              private muestraService: MuestraService,
              private route: ActivatedRoute,
              private rolesPermisosServices: RolesPermisosService) {
      this.Permisos = new Permisos();

      this.ensayo = new Ensayo();

      this.apiurl = environment.apiUrl;
      this.formaMuestras = new FormGroup({
      imagen: new FormControl(''),
      codigo: new FormControl(''),
      descripcion: new FormControl(''),
      fecha_ingreso: new FormControl(new Date().toISOString().split('T')[0]),
      observaciones: new FormControl(''),
      imagen_perfil: new FormControl('')
    })
  }
  guardaMuestra() {
    if (this.formaMuestras.value.codigo === '') {
      alert('El codigo es necesario para crear una muestra');
      return;
    }
    this.muestraFinal['imagen_perfil'] = this.imagePath;
    this.muestraFinal['codigo'] = this.formaMuestras.value.codigo;
    this.muestraFinal['descripcion'] = this.formaMuestras.value.descripcion;
    this.muestraFinal['fecha_ingreso'] = this.formaMuestras.value.fecha_ingreso;
    this.muestraFinal['observaciones'] = this.formaMuestras.value.observaciones;
    this.muestraService.add(this.muestraFinal).subscribe((value: any) => {
    document.querySelector('#create-muestra').classList.remove('md-show');
    console.log(value)
    if (value.success) {
        this.cargarMuestras(0);
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Muestra Creda', type: 'success' });
        if (this.archivosMuestras.length > 0) {
          console.log(this.archivosMuestras[0])
          this.archivosMuestras[0].forEach(element => {
            const url = `${this.apiurl}upload/files_client/${element.filename}?name=${element.originalname}`;
            const nombre = element.originalname;
            this.muestraService.updatearchivos({url: url, nombre: nombre}, value.muestraShared._id)
            .subscribe(resp => {});
          });
        }
      } else {
        alert(value.message);
        document.querySelector('#create-muestra').classList.add('md-show');
        return;
        // this.notificationService.addNotify({ title: 'Alerta', msg: value.message, type: 'error' });
        // return;
      }
    });

  }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.muestras[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
    const $invite = this.route.snapshot.queryParamMap.get('invite');
    this.tabdata();
    this.tipocomentario = 1;
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.imagePath = `${this.apiurl}upload/files_client/${JSON.parse(response).file.filename}`;
    };
    this.cargarMuestras(0);
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.muestras[0];
          console.log(this.Permisos);
          console.log(this.permisosLocal);
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  cargarMuestras(desde) {
    this.desde = desde;
    if (desde < 0) {
      this.desde = 0;
    }
    if (this.desde !== 0) {
      this.estado = true;
    }
    this.Muestras = [];
    this.muestraService.get(this.desde).subscribe( (MuestrasResponse: any) => {

      if (MuestrasResponse.success) {
        this.Muestras = MuestrasResponse.muestras;
        if (this.Muestras.length < 5) {
          this.continue = false;
        } else {
          this.continue = true;
        }
      }

    });
  }
  buscarMuestra(event) {
    if ( event.target.value === '') {
      return;
    }
    this.muestraService.getBuscarMuestras(event.target.value).subscribe( (resp: any) => {
      if (resp.success) {
        this.Muestras = resp.muestras;
      }
    });
  }
  openMyModal2(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }
  openMyModal(event) {
    this.ensayo = new Ensayo();
    this.ensayo.creocli = false;
    this.ensayo.creolab = true;
    this.ensayo.fsolicitud = moment().format('YYYY-MM-DD');
    this.ensayo.fEnsayo = moment().format('YYYY-MM-DD');
    this.ensayo.fEntrega = moment().format('YYYY-MM-DD');

    this.ensayo.estado = 'Esperando Confirmación';
    document.querySelector('#' + event).classList.add('md-show');

  }

  closeMyModal(event) {
    document.querySelector('#effect-3').classList.remove('md-show');

  }
  closeMyModal2(event) {
    document.querySelector('#' + event).classList.remove('md-show');

  }
  editarEnsayo(ensayo, lugar) {

    this.ensayo = null;
    this.ensayoservice.getById(ensayo._id).subscribe((value: any) => {
      value.ensayos.muestras.forEach((element, index) => {
        this.muestraService.getById(element).subscribe((resp: any) => {
          this.ensayo.muestras[index] = resp.muestra;
        });
      });
      this.openMyModal('effect-3');
      this.ensayo = value.ensayos;
      this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format('YYYY-MM-DD');
      this.ensayo.fEnsayo = this.ensayo.fEnsayo == undefined ? moment().format('YYYY-MM-DD') : moment(this.ensayo.fEnsayo).format('YYYY-MM-DD');
      this.ensayo.fEntrega = this.ensayo.fEntrega == undefined ? moment().format('YYYY-MM-DD') : moment(this.ensayo.fEntrega).format('YYYY-MM-DD');
      this.ensayo.fFacturado = this.ensayo.fFacturado == undefined ? undefined : moment(this.ensayo.fFacturado).format('YYYY-MM-DD');
      this.ensayo.fVencimiento = this.ensayo.fVencimiento == undefined ? undefined : moment(this.ensayo.fVencimiento).format('YYYY-MM-DD');

      if (this.ensayo.reporte == undefined) {
        this.ensayo.reporte = new Reporte();
      }
      if (this.tabactive === 'tab-finalizado') {
        this.tabset.select("reporteTab");
      } else if (this.tabactive === 'tab-proceso') {
        this.tabset.select("resultadoTab");
      } else {
        this.tabset.select("solicitudTab");
      }
      setTimeout(() => {
        if (lugar === 'pagos') {
          document.getElementById('pagosTab').classList.add('active');
          document.getElementById('pagosTab').click();
        }
      }, 1000)
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }


  cargarEnsayos(estado) {
    this.ensayoservice.getEstado(1, estado).subscribe((value: any) => {

      this.ensayos = value.ensayos;
      this.indicadores = value.indicadores;
      this.pagos = value.pagos;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  reloaddata(value) {
    if (value === 'cargar') {
      this.tabdata();
    } else if (value === 'hide') {
      this.closeMyModal(null);
    }

  }
  closeMyModalAyuda(event) {
    document.querySelector('#'+ event).classList.remove('md-show');

  }

  public beforeChange($event: NgbTabChangeEvent) {
    this.tabactive = $event.nextId;
    this.tabdata();
  }
  tabdata() {
    if (this.tabactive === 'tab-pendientes') {
      this.cargarEnsayos('Pendientes');
    } else if (this.tabactive === 'tab-proceso') {
      this.cargarEnsayos('Proceso');
    } else if (this.tabactive === 'tab-finalizado') {
      this.cargarEnsayos('Finalizado');
    } else {
      this.cargarEnsayos('Pendientes');
    }
  }
  calcularVigencia(fila) {
    let now = moment();
    let b = moment(fila.fEntrega);
    let diff = b.diff(now, 'days');
    if (isNaN(diff)) {
      return 0;
    }
    return b.diff(now, 'days');

  }
  beforeChangeEnsayo($event: NgbTabChangeEvent) {
    this.tabactivesol = $event.nextId;
    if (this.tabactivesol === 'solicitudTab') {
      this.tipocomentario = 1;
    } else if (this.tabactivesol === 'resultadoTab') {
      this.tipocomentario = 2;
    } else if (this.tabactivesol === 'reporteTab') {
      this.tipocomentario = 3;
    } else {
      this.tipocomentario = 1;
    }
  }
  eliminar() {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar este Ensayo ?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.ensayo.estado = 'Eliminado';
        this.guardarEnsayo();
      }

    );
  }
  guardarEnsayo() {
    this.ensayoservice.update(this.ensayo).subscribe((value: any) => {
      this.tabdata();
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo Actualizado con exito', type: 'success' });
      this.closeMyModal('effect-3');
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });

  }

  verInfoPagos() {
    const tabInfoPagos = document.getElementById('pagosTab');
    tabInfoPagos.click();
  }

  uploadfile1(value) {

    this.archivosMuestras = [];
    this.archivosMuestras.push(value);
  }
  handleFileInput(file) {
    if (file.files && file.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePath = `${e.srcElement['result']}`;
      };
      reader.readAsDataURL(file.files[0]);
    }
  }
  buscadorpasodossolicitudes(event) {
    const texto = event.target.value.toLowerCase();
    const arrayP1 = [];
    if(texto.length === 0) {
      this.tabdata();
    } else {
      for (let paso of  this.ensayos) {
        let codigo = paso.codigo.toLowerCase();
        let nombreCliente = paso.nombreCliente.toLowerCase();
        if (codigo.indexOf(texto) !== -1 || nombreCliente.indexOf(texto) !== -1) {
          arrayP1.push(paso);
        }
      }
      this.ensayos = arrayP1;
    }
  }
}

