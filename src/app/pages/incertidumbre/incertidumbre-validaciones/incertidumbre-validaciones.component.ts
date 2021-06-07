import { Component, Input, OnInit, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import swal from 'sweetalert2';

import { Condicion } from '../../../models/condicion';
import { Validacion } from '../../../models/validacion';
import { ParametroCalibacionService } from '../../../services/parametro-calibacion/parametro-calibacion.service';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { ListaGlobal } from '../../../shared/listadosGlobal/listaGlobal';
import { NotificationService } from '../../../shared/notification';

@Component({
  selector: 'app-incertidumbre-validaciones',
  templateUrl: './incertidumbre-validaciones.component.html',
  styleUrls: ['./incertidumbre-validaciones.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class IncertidumbreValidacionesComponent implements OnInit, OnChanges {

  @Input() parametroId: any;
  parametroresult: any;
  parametro: any;
  formulaactual: any;
  resultadoEvaluacion: any;
  reload: any;
  ensayos: any;
  subscription: any;
  condicionnew: Condicion;
  validacionnew: Validacion;
  editindex: any;
  @ViewChild('mathEditor') mathEditor;
  camposeleccionado: any;
  reloadformula: boolean;
  constructor(
    public parametroCalibacionService: ParametroCalibacionService,
    private notificationService: NotificationService,
    public parametroService: ParametroService,
    private listaGlobal: ListaGlobal,
  ) {
    this.reload = true;
    this.ensayos = [];
    this.condicionnew = new Condicion();
    this.validacionnew = new Validacion();
    this.reloadformula=true;
  }
  getParametroByID() {
    if (this.parametroId != undefined) {
      this.parametroService.getById(this.parametroId).subscribe((parametro) => {
        this.parametro = parametro['parametros'];
        this.formulaactual = this.parametro.formula;

      });
    }
  }


  ngOnInit() {
    this.getParametroByID();

  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.parametroId != undefined) {
      this.parametroId = changes.parametroId.currentValue;
      this.getParametroByID();

    }
  }
  actualizardatos(save) {
    this.parametroService.update(this.parametro).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Parametro actualizado con exito', type: 'success' });
      this.reload = true;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  onChangeFormula(result) {
    setTimeout(() => {
      this.resultadoEvaluacion = result;
    });
  }
  guardar() {
    this.actualizardatos(true);
  }
  selectCondicion($event) {

  }
  agregarcondicion() {
    if (this.validacionnew.condiciones == undefined) {
      this.validacionnew.condiciones = [];
    }
    this.validacionnew.condiciones.push({ ...this.condicionnew });
    this.condicionnew = new Condicion();
  }
  validaentonces() {
    let result = true;
    if (this.validacionnew.condiciones != undefined) {
      for (let i = 0; i < this.validacionnew.condiciones.length; i++) {
        if (this.validacionnew.condiciones[i].condicion2 == "Entonces") {
          result = false;
          break;
        }
      }
    }

    return result;
  }
  guardarCondicion() {
    this.reloadformula=false;
    if (this.parametro.validaciones == undefined) {
      this.parametro.validaciones = [];
    }
    if (this.editindex == undefined) {
      this.parametro.validaciones.push({ ...this.validacionnew });
    } else {
      this.parametro.validaciones[this.editindex] = { ...this.validacionnew };
    }
    this.editindex = undefined;
    this.validacionnew = new Validacion();
    this.reloadformula=true;
  }
  crearCondicion(condiciones) {
    let result;
    result = '';
    condiciones.map((x) => {
      result += ' ' + this.evaluarCondicion(x);
    });


    return result;


  }
  evaluarCondicion(condicion) {
    let result;
    result = '';

    if (condicion.valor1 == 'Otro'||condicion.valor1 == 'Formula') {
      result += ' ' + condicion.valorOtro1;
    } else {
      result += ' ' + condicion.valor1;
    }
    result += ' ' + condicion.condicion1;
    if (condicion.valor2 == 'Otro'||condicion.valor1 == 'Formula') {
      result += ' ' + condicion.valorOtro2;
    } else {
      result += ' ' + condicion.valor2;
    }
    if (condicion.valor3 == 'Otro') {
      result += ',' + condicion.valorOtro3;
    } else if (condicion.valor3 != undefined) {
      result += ',' + condicion.valor3;
    }
    if (condicion.condicion2 == 'Entonces') {
      result += ' = ' + condicion.resultado;
    } else {
      result += ' ' + condicion.condicion2;
    }
    return result;

  }
  celiminarItem(index) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea eliminar el registro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.parametro.validaciones.splice(index, 1);

      }
    }
    );
  }
  editarItem(index) {
    this.reloadformula=false;
    this.editindex = index;
    this.validacionnew = this.parametro.validaciones[index];
    this.reloadformula=true;
  }
  eliminarVariable(index) {
    swal({
      title: 'Alerta!',
      text: 'Realmente desea eliminar el registro?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.validacionnew.condiciones.splice(index, 1);
      }
    }
    );

  }
  modalOpen(modal) {

    document.querySelector('#' + modal).classList.add('md-show');
    this.reloadformula=false;
  }
  closeModal(modal) {
    document.querySelector('#' + modal).classList.remove('md-show');
    this.formulaactual = undefined;
  }
  seleccionaLista($event, campo) {
    if ($event.target.value == "Formula") {
      this.camposeleccionado = campo;
      this.modalOpen("modalMuestra");
    }
  }
  guardarFormula() {

    if (this.camposeleccionado == "valor1") {
      this.condicionnew.valorOtro1 = this.mathEditor.getFormula();
    }
    else  if (this.camposeleccionado == "valor2") {
      this.condicionnew.valorOtro2= this.mathEditor.getFormula();
    }
    this.reloadformula=true;
    this.closeModal("modalMuestra");
  }

}
