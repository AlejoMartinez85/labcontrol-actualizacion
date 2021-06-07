import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../shared/notification';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { Ensayo } from '../../../models/ensayo';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import { FiledownloadService } from '../../../services/filedownload/filedownload.service';
import { Actividad } from '../../../models/actividad';
import { ActividadService } from '../../../services/actividad/actividad.service';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { Cliente } from '../../../models/cliente';
import swal from 'sweetalert2';
import { MuestraService } from '../../../services/muestra/muestra.service';
import { environment } from '../../../../environments/environment';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import * as XLSX from 'xlsx';
import { forEach } from '@angular/router/src/utils/collection';
import { ConfiguracionReporteService } from '../../../services/configuracion-reporte/configuracion-reporte.service';
import { EstructuraServiceService } from '../../../services/Estructura/Estructura-service.service';
@Component({
  selector: 'app-resultado-view',
  templateUrl: './resultado-view.component.html',
  styleUrls: ['./resultado-view.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class ResultadoViewComponent implements OnInit, OnChanges {
  fileName = 'ExcelSheet.xlsx';
  preloader = false;
  ensayo: Ensayo;
  ensayo_id: any;
  user: any;
  muestras: any;
  cargando: Boolean = true;
  muestrasMaster: any;
  @Input() idensayo: any;
  @Input() estructura: string;
  @Input() print: boolean;
  @Input() autoSabe: boolean = true;
  estructuras: any;
  cliente = {
    _id: 0,
    nombre: '',
    nid: '',
    tid: '',
    nombre_contacto: '',
    email_contacto: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    telefonos: [],
    telefono: '',
    logicalerasure: false,
    descripcion: '',
    tipo: 0,
    password: '',
    usuarios: [],
    clientes: [],
    laboratorios: [],
    invite: [],
    imagen: '',
    encReporte: '',
    pieReporte: '',
    imagenes: []
  };
  muestrassobrabtres = [];
  parametros_muestrassobrabtres = [];
  editProfileIcon = 'icofont-edit';
  editProfile = false;
  @ViewChild('myckeditor') ckeditor: any;
  @ViewChild('myckeditor2') ckeditor2: any;
  @ViewChild('myckeditor3') ckeditor3: any;
  @ViewChild('editorPie') editorPie: any;
  @ViewChild('editorPie2') editorPie2: any;
  @ViewChild('editorPie3') editorPie3: any;
  @ViewChild('modaladd') modaladd: any;
  @ViewChild('tableResult') tableResult: any;
  @ViewChild('editorResult') editorResult: any;
  estilos = { 'height': 'auto', 'overflow': 'auto', 'display': 'block' };
  ckeconfig: any;
  @Output() saveData = new EventEmitter<any>();
  nombre: string;
  apiurl: string;
  campo1 = false;
  campo2 = false;
  campo3 = false;
  campo4 = false;
  campo5 = false;
  variableTecnica = false;
  editorImg: any;
  configuraciones = [];
  columns = [];
  imagenSel: any;
  muestrasParametrosValores = {};
  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg']
  });
  constructor(private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private route: ActivatedRoute,
    private filedownloadService: FiledownloadService,
    private actividadService: ActividadService,
    private muestraService: MuestraService,
    private clienteService: ClienteService,
    private estructuraService: EstructuraServiceService,
    private parametroService: ParametroService,
    private configuracionReporteService: ConfiguracionReporteService) {
    this.apiurl = environment.apiUrl;
    // this.cliente = new Cliente();
    this.uploader.onWhenAddingFileFailed = (fileItem, filter) => {
      if (filter.name = 'mimeType') {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Solo se permite archivos de tipo imagen ', type: 'error' });
      }
    };
    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit() {
    this.ensayo = new Ensayo();
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    this.ensayo_id = this.idensayo;
    this.editarEnsayo();
    this.cartgarConfiguraciones();
    this.ckeconfig = {
      allowedContent: false,
      extraPlugins: 'divarea'

    };
    this.estructuraService.get(0).subscribe(resp => {
      if (resp.success) {
        this.estructuras = resp.Layouts;
      } else {
        alert(resp.message);
      }
    });
  }
  exportexcel(): void {
    let codigo: String = 'Actual';
    /* table id is passed over here */
    if (this.ensayo.reporte !== undefined) {
      codigo = 'Datos Informe No ' + this.ensayo.reporte.codigoinforme;
    }
    this.fileName = codigo + '.xlsx';
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: false });
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
  onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    const file = JSON.parse(response).file;
    this.cliente.imagenes.push(file);

    this.actualizarItem(this.cliente);
  }
  actualizarItem(item) {

    this.clienteService.update(item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Usario actualizado con exito', type: 'success' });
      item.edit = false;

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }
  cartgarConfiguraciones() {
    this.configuraciones = [];
    this.parametroService.getConfigParametros(1).subscribe(valores => {
      if (valores.success) {
        if (valores.configuracion.length > 0) {
          this.configuraciones = valores.configuracion;
          if (this.configuraciones[0].variable1) {
            this.campo1 = true;
            this.columns[0] = this.configuraciones[0]['titulo1'];
          } else {
            this.columns[0] = '';
          }
          if (this.configuraciones[0].variable2) {
            this.campo2 = true;
            this.columns[1] = this.configuraciones[0]['titulo2'];
          } else {
            this.columns[1] = '';
          }
          if (this.configuraciones[0].variable3) {
            this.campo3 = true;
            this.columns[2] = this.configuraciones[0]['titulo3'];
          } else {
            this.columns[2] = '';
          }
          if (this.configuraciones[0].variable4) {
            this.campo4 = true;
            this.columns[3] = this.configuraciones[0]['titulo4'];
          } else {
            this.columns[3] = '';
          }
          if (this.configuraciones[0].variable5) {
            this.campo5 = true;
            this.columns[4] = this.configuraciones[0]['titulo5'];
          } else {
            this.columns[4] = '';
          }
          if (this.configuraciones[0].variableTecnica) {
            this.variableTecnica = true;
          }
        }
      }
    });
  }
  descargar() {
    const a = document.createElement('a');
    a.download = `INFORME DE RESULTADOS No. ${this.ensayo.reporte.codigoinforme}`;
    a.target = '_blank';
    a.href = this.ensayo.urlPdf;
    a.click();
  }
  editarEnsayo() {
    this.muestrasMaster = [];
    this.muestras = [];
    this.muestrassobrabtres = [];
    this.ensayoservice.getReporte(this.ensayo_id).subscribe((value) => {
      this.ensayo = value.ensayos;
      console.log(this.ensayo);
      this.cliente._id = this.ensayo.cliente._id,
      this.cliente.nombre = this.ensayo.cliente.nombre;
      this.cliente.nid = this.ensayo.cliente.nid;
      this.cliente.tid = this.ensayo.cliente.tid;
      this.cliente.nombre_contacto = this.ensayo.cliente.nombre_contacto;
      this.cliente.email_contacto = this.ensayo.cliente.email_contacto;
      this.cliente.direccion = this.ensayo.cliente.direccion;
      this.cliente.ciudad = this.ensayo.cliente.ciudad;
      this.cliente.departamento = this.ensayo.cliente.departamento;
      this.cliente.telefonos = this.ensayo.cliente.telefonos;
      this.cliente.telefono = this.ensayo.cliente.telefono;
      this.cliente.logicalerasure = this.ensayo.cliente.logicalerasure;
      this.cliente.descripcion = this.ensayo.cliente.descripcion;
      this.cliente.tipo = this.ensayo.cliente.tipo;
      this.cliente.password = this.ensayo.cliente.password;
      this.cliente.usuarios = this.ensayo.cliente.usuarios;
      this.cliente.clientes = this.ensayo.cliente.clientes;
      this.cliente.laboratorios = this.ensayo.cliente.laboratorios;
      this.cliente.invite = this.ensayo.cliente.invite;
      this.cliente.imagen = this.ensayo.cliente.imagen;
      this.cliente.encReporte = this.ensayo.cliente.encReporte;
      this.cliente.pieReporte = this.ensayo.cliente.pieReporte;
      this.cliente.imagenes = this.ensayo.cliente.imagenes;
      const muestras = [];
      this.ensayo.muestras.forEach((element, index) => {
        this.muestraService.getById(element).subscribe(resp => {
          if (resp.success) {
            muestras[index] = resp.muestra;
          }
        });
      });

      this.muestras = muestras;
      
      this.configuracionReporteService.get().subscribe(valores => {
        if (valores.success) {

          // REVISAR esto hace que si el cliente esta viendo el informe parta las muestras cada 3 sin embargo las debe partir en lo que el susuario del ensayo lo hizo o en su defecto que vea el informe como solo un html ,
          if(this.user.tercero.tipo == 1){
             var rangoMuestras = 3;
          }else{
            rangoMuestras = valores.configuracion[0].numeroMuestras;
          }
          const numMuestras = this.muestras.length;
          if (numMuestras > rangoMuestras) {
            for (let _i = rangoMuestras; _i < this.muestras.length; _i = _i + rangoMuestras) {
              const arrayMuestrasTemp = this.muestras.slice(_i - rangoMuestras, _i);
              this.muestrasMaster.push(arrayMuestrasTemp);
              if ((_i + rangoMuestras) >= this.muestras.length) {
                const __i = _i + rangoMuestras;
                const arrayMuestrasTemp = this.muestras.slice(__i - rangoMuestras, __i);
                this.muestrasMaster.push(arrayMuestrasTemp);
              }
            }
          } else {
            this.muestrasMaster.push(this.muestras);
          }
          this.ensayo.parametros.forEach(parametro => {
            const muestrasParametroMaster = [];

            if (numMuestras > rangoMuestras) {
              for (let _i = rangoMuestras; _i < parametro.muestras.length; _i = _i + rangoMuestras) {
                const arrayMuestrasTemp = parametro.muestras.slice(_i - rangoMuestras, _i);
                muestrasParametroMaster.push(arrayMuestrasTemp);
                if ((_i + rangoMuestras) >= this.muestras.length) {
                  const __i = _i + rangoMuestras;
                  const arrayMuestrasTemp = parametro.muestras.slice(__i - rangoMuestras, __i);
                  muestrasParametroMaster.push(arrayMuestrasTemp);
                }
              }
            } else {
              muestrasParametroMaster.push(parametro.muestras);
            }
            parametro.muestrasMaster = muestrasParametroMaster;
            const result = parametro.muestras.map(a => a.valor);
            for (let i = 0; i < result.length; i++) {
              result[i] = result[i].replace(',', '.');
            }
            const object2 = Object.assign({}, parametro.muestras, { valor: 22 });
            for (let i = 0; i < parametro.muestras.length; i++) {
              parametro.muestras[i] = Object.assign({}, parametro.muestras[i], { valor: result[i] });
            }
          });
        }
      });
      
      this.cargando = false;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  download() {
    this.filedownloadService.download(this.ensayo._id)
      .subscribe((value) => {
        FileSaver.saveAs(value, this.ensayo.codigo + '.pdf');
        this.guardarActividades('Reporte descargado', 'Reporte');
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Archivo descargado con exito', type: 'success' });
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'No se pudo descargar el archivo', type: 'error' });
      });
    return false;
  }
  imprimir() {
    window.print();
    this.guardarActividades('Reporte Impreso', 'Reporte');
  }
  guardarActividades(descripcion, tipoComentario) {
    const actividad = new Actividad();
    actividad.cliente = this.ensayo.cliente;
    actividad.descripcion = descripcion;
    actividad.ensayo = this.ensayo._id;
    actividad.tercero = this.user.tercero;
    actividad.usuario = this.user.id;
    actividad.fecha = new Date().toISOString().split('T')[0];
    actividad.nombreUsuarioCreador = this.user.name;
    actividad.tipoComentario = tipoComentario;
    this.actividadService.add(actividad).subscribe((value) => {

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'No se pudo almacenar la audirotia ', type: 'error' });
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    this.ensayo = new Ensayo();
    this.ensayo_id = changes.idensayo.currentValue;
    // this.editarEnsayo();
    this.editProfile = false;
  }
  toggleEditProfile() {
    this.editProfileIcon = (this.editProfileIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editProfile = !this.editProfile;
  }
  addVariable(event, editor) {
    const editroSel = this.seleccioareditor(editor);
    editroSel.instance.insertHtml('{' + event.target.value + '}');
  }
  seleccioareditor(editor) {
    switch (editor) {
      case 'myckeditor':
        return this.ckeditor;
      case 'editorPie':
        return this.editorPie;
      case 'editorResult':
        return this.editorResult;
    }
  }
  openMyModal(event, editorImg) {
    document.querySelector('#' + event).classList.add('md-show');
    this.editorImg = editorImg;

  }
  cactualizarensayo() {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas actualizar el encabezado del reporte?',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'No',
      useRejections: true
    }).then((result) => {
      console.log(this.ensayo)
      this.actualizarensayo();
    }
    );
  }
  actualizarensayo() {
    this.ensayoservice.update(this.ensayo).subscribe((value) => {
      this.toggleEditProfile();
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo actualizado con exito', type: 'success' });
      this.editarEnsayo();
      this.saveData.emit([this.ensayo.encReporte, this.ensayo.pieReporte]);
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  insertarImagen(imagen, event) {

    const urlImg = this.apiurl + 'upload/files_client/' + imagen.filename + '?name=' + imagen.originalname;
    const editoSel = this.seleccioareditor(this.editorImg);
    editoSel.instance.insertHtml('<img src="' + urlImg + '" >');
    this.notificationService.addNotify({ title: 'Alerta', msg: 'Imagen insertada con exito', type: 'success' });
    this.closeMyModal(event);
  }
  closeMyModal(event) {
    document.querySelector('#effect').classList.remove('md-show');

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
        this.actualizarItem(this.cliente);
      }
    });
  }
  onOptionsSelected(id) {
    localStorage.removeItem('header');
    localStorage.removeItem('footer');
    if (id !== '') {
      this.preloader = true;
      this.estructuraService.getId(id).subscribe((resultado: any) => {
        if (resultado.success) {
          this.ensayo.encReporte = resultado.Layout.header;
          this.ensayo.pieReporte = resultado.Layout.footer;
          localStorage.setItem('header', resultado.Layout.header);
          localStorage.setItem('footer', resultado.Layout.footer);
          this.ensayoservice.update(this.ensayo).subscribe((value) => {
            this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo actualizado con exito', type: 'success' });
            this.saveData.emit(this.ensayo);
            this.preloader = false;
          }, err => {
            this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
          });
        } else {
          this.notificationService.addNotify({ title: 'Alerta', msg: resultado.message, type: 'error' });
        }
      });
    } else {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Seleccione una estructura Válida', type: 'error' });
      return;
    }
  }
  changueEstructura(event) {
    this.actualizarensayo();
    this.ensayoservice.update(this.ensayo).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo actualizado con exito', type: 'success' });
      this.saveData.emit(this.ensayo.encReporte);
      this.saveData.emit(this.ensayo.pieReporte);
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  editResultado() {


    this.ensayo.bodyReporte = this.tableResult.nativeElement.outerHTML;
    this.ensayo.editarBody = true;
  }
  verOriginal() {
    this.ensayo.editarBody = false;

  }
}
