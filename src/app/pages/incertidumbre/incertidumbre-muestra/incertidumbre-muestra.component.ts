import {
  Component, Input, OnInit, SimpleChanges, OnChanges,
  Directive, ElementRef, HostListener, EventEmitter, Output,
  ViewChild
} from '@angular/core';
import { eventNames } from 'process';
import { ParametroCalibacionService } from '../../../services/parametro-calibacion/parametro-calibacion.service';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { NotificationService } from '../../../shared/notification';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { animate, style, transition, trigger } from '@angular/animations';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
@Component({
  selector: 'app-incertidumbre-muestra',
  templateUrl: './incertidumbre-muestra.component.html',
  styleUrls: ['./incertidumbre-muestra.component.scss',
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
export class IncertidumbreMuestraComponent implements OnInit, OnChanges {

  @Input() parametroId: any;
  @Input() cancelarbutton: boolean;
  parametroresult: any;
  parametro: any;
  formulaactual: any;
  resultadoEvaluacion: any;
  reload: any;
  ensayos: any;
  subscription: any;
  public validacionCheck: boolean = false;
  datoCopypaste = [];
  cabeceras = [];
  displayedColumns: string[];
  @Output() endAction = new EventEmitter<any>();
  @ViewChild('modaladd') modaladd: any;
  muestraSeleccionada: any;
  user: any;
  Permisos: Permisos;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  constructor(
    public parametroCalibacionService: ParametroCalibacionService,
    private notificationService: NotificationService,
    public parametroService: ParametroService,
    public rolesPermisosServices: RolesPermisosService
  ) {
    this.reload = true;
    this.ensayos = [];
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.incertidumbre[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.usuarios[0];
          console.log(this.permisosLocal)
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
      //MEnsaje personalisado 
    }
  }
  getParametroByID() {
    if (this.parametroId != undefined) {
      this.parametroService.getById(this.parametroId).subscribe((parametro) => {
        this.parametro = parametro['parametros'];
        this.formulaactual = this.parametro.formula;
        this.actualizardatos(false);
      });
    }
  }
  copypaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');
    this.datoCopypaste = [];
    this.displayedColumns = row_data[0].split('\t');
    row_data.forEach(row_data => {
      this.datoCopypaste.push(row_data.split('\t'));
    });
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
  getEnsayosByID() {
    this.cabeceras = ['Fecha', 'Descripción'];
    if (this.parametroId != undefined) {
      console.log(this.parametroId)
      this.parametroCalibacionService.getById(this.parametroId).subscribe((parametro) => {
        this.ensayos = parametro.parametros;
          this.ensayos[0].variables.forEach((element, index) => {

            this.cabeceras.push(`Variable ${index + 1}`);

          });
      });
    }

  }
  EditarDato(parametro) {
    console.log(new Date (parametro.fechaRegistro))
    console.log(new Date ())
    // parametro.fechaRegistro = new Date (parametro.fechaRegistro)
    this.parametroCalibacionService.updateParamstroCalibacion(parametro).subscribe( (resp: any) => {
      console.log(resp)
      if (resp.success) {
        this.notificationService.addNotify({ title: 'Listado de mediciones', msg: resp.message, type: 'success' });
        this.getEnsayosByID()
        // location.reload();
      } else {
        this.notificationService.addNotify({ title: 'Listado de mediciones', msg: resp.message, type: 'danger' });
      }
    });
  }
  eliminarParametroCalibracion(parametro) {
    swal({
      title: 'Alerta!',
      text: '¿ Deseas eliminar este parametro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x,
    }).then((result) => {
      if ( result ) {
        this.parametroCalibacionService.deleteParamstroCalibacion(parametro).subscribe( (resp: any) => {
          if (resp.success) {
            this.notificationService.addNotify({ title: 'Listado de mediciones', msg: resp.message, type: 'success' });
            this.getEnsayosByID()
          } else {
            this.notificationService.addNotify({ title: 'Listado de mediciones', msg: resp.message, type: 'danger' });
          }
        })
      }
    });
  }
  ngOnInit() {
    this.getParametroByID();
    this.getEnsayosByID();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.parametroId != undefined) {
      this.parametroId = changes.parametroId.currentValue;
      this.getParametroByID();
      this.getEnsayosByID();
    }
  }
  actualizardatos(save) {
    console.log(this.parametro)
    this.parametro.save = save;
    this.parametro.resultado = this.resultadoEvaluacion;
    this.reload = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.parametroCalibacionService.add(this.parametro).subscribe((value) => {
      this.parametroresult = value.data;
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Parametro almacenado con exito', type: 'success' });
      this.reload = true;
      if (save === true) {
        this.getEnsayosByID();
        if (this.endAction != undefined) {
          this.endAction.emit(this.parametroresult);
        }
      }
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  onChangeFormula(result) {
    setTimeout(() => {
      this.resultadoEvaluacion = result;
    });
  }
  guardar(event) {
    this.actualizardatos(true);
  }
  cancelar() {
    this.endAction.emit(undefined);
  }
  evaluardecimal() {
    if (this.parametro.ndecimales == undefined || this.parametro.ndecimales == '') {
      return '4';
    }
    return this.parametro.ndecimales;
  }
  cambioValor(event) {
    this.validacionCheck = event.target.checked;
  }
  modalOpen(modal) {

    document.querySelector('#' + modal).classList.add('md-show');
  }
  closeModal(modal) {
    document.querySelector('#' + modal).classList.remove('md-show');
    this.formulaactual = undefined;
  }

  abrirDetalle(item) {

    this.muestraSeleccionada = item;
    this.modalOpen('modalMuestra');
  }

  
  formMasivo() {
    let contador = 0;
    console.log(this.datoCopypaste)
    this.datoCopypaste.forEach( element => {
      const fecha = element[0].split('/')
      this.parametro.fechaRegistro = moment(fecha[0] + fecha[1] + fecha[2], "DDMMYYYY").format();
      this.parametro.descripcion = element[1]
      element.forEach((element, index) => {
        if ( index > 1) {
          this.parametro.variables[index - 2].valor = parseFloat(element);
          this.actualizardatos(false)
        }
      });
      this.actualizardatos(true);
      contador = contador + 1;
      this.closeModalguardado(contador)
    })
  }
  closeModalguardado(contador:number) {
    console.log('limite',this.datoCopypaste.length)
    console.log('contador',contador)
    if (contador === this.datoCopypaste.length) {
      this.closeModal('carga-masiva');
      this.datoCopypaste = [];
    }
  }
}
@Directive({
  selector: '[appRemoveAlert]'
})
export class RemoveAlertDirective {
  alert_parent: any;
  constructor(private elements: ElementRef) { }

  @HostListener('click', ['$event'])
  onToggle($event: any) {
    $event.preventDefault();
    this.alert_parent = (this.elements).nativeElement.parentElement;
    this.alert_parent.remove();
  }


}
