import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementoCalibracion } from '../../../models/elementoCalibracion';
import { ListaGlobal } from '../../../shared/listadosGlobal/listaGlobal';
import { VariableService } from '../../../services/variable/variable.service';
import { NotificationService } from '../../../shared/notification';
import * as ss from 'simple-statistics';
import { Variable } from '../../../models/variable';


@Component({
  selector: 'app-incertidumbre-element-add',
  templateUrl: './incertidumbre-element-add.component.html',
  styleUrls: ['./incertidumbre-element-add.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class IncertidumbreElementAddComponent implements OnInit {
  item: any;
  form: FormGroup;

  
  variablenew: any;
  reload: boolean;
  formulaactual = '';
  resultadoEvaluacion: any;
  @Output() endAction = new EventEmitter<any>();
  @Input() elementoedit: any;
  @Input() variableprincipal: any;
  datoNew: any;
  @ViewChild('mathEditor') mathEditor;
  constructor(private formBuilder: FormBuilder,
    private listaGlobal: ListaGlobal,
    private notificationService: NotificationService,
    private variableService: VariableService) {
    this.reload = true;
    this.item = new ElementoCalibracion();
    this.item.manual = true;
    this.variablenew = new Variable();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: [null, Validators.required],
      tipoIncertidumbre: [null, Validators.required],
      observaciones: [],
      formula: []
    });
    if (this.elementoedit != undefined) {
      this.item = this.elementoedit;
      this.formulaactual = this.item.formula;
    }
    if (this.item.variables == undefined || this.item.variables.length == 0) {
      this.item.variables = [];
      this.variableprincipal.principal = true;
      this.item.variables.push({
        _id: this.variableprincipal._id,
        simbolo: this.variableprincipal.simbolo,
        nombre: this.variableprincipal.nombre,
        valor: this.variableprincipal.valor,
        principal: true
      });
    }
  }
  guardarParametro(event) {
    if (this.item.variables === undefined) {
      this.item.variables = [];

    }
    if (this.variablenew.simbolo == '' && this.variablenew.valor == '') {
      return false;
    }

    this.insertarVariable({ ...this.variablenew });


  }
  actualizarParametro(variable) {
    if (variable.simbolo == '' && variable.valor == '') {
      return false;
    }
    this.insertarVariable(variable);
  }
  insertarVariable(variable) {
    this.reload = false;
    this.formulaactual = this.mathEditor.getFormula();

    if (variable._id != undefined) {
      this.variableService.update(variable).subscribe((value) => {
        this.variablenew = { simbolo: '', valor: '' };
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Variable registrada con exito', type: 'success' });
        this.reload = true;
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    } else {
      this.variableService.add(variable).subscribe((value) => {
        this.reload = false;
        this.item.variables.push(value.data);
        setTimeout(() => {
          this.reload = true;
        });
        this.variablenew = new Variable();
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Variable registrada con exito', type: 'success' });
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });

    }
  }
  onChangeFormula(result) {
    setTimeout(() => {
      this.resultadoEvaluacion = result;
    });

  }
  celiminarDato(index) {

    this.item.datos.splice(index, 1);
    this.calculaerEstadistica();
  }
  eliminarVariable(variable) {
    this.reload = false;
    this.variableService.delete(variable._id, variable).subscribe((value) => {
      this.variablenew = { simbolo: '', valor: '' };
      let varfind = this.item.variables.findIndex((x) => x._id == variable._id);
      this.item.variables.splice(varfind, 1);
      this.reload = true;
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Variable elimianda con exito', type: 'success' });
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  guardar(event) {
    this.item.valor = this.resultadoEvaluacion;
    this.item.formula = this.mathEditor.getFormula();
    this.endAction.emit(this.item);
  }
  cancelar(event) {
    this.endAction.emit(null);
  }
  agregarDato() {

    if (this.item.datos == undefined) {
      this.item.datos = [];
    }
    this.item.datos.push(this.datoNew);
    this.calculaerEstadistica();
    this.datoNew = '';
  }
  calculaerEstadistica() {
    let s, xbar, n;
    n = this.item.datos.length;
    if (n > 1) {
      xbar = ss.mean(this.item.datos);
      s = ss.sampleStandardDeviation(this.item.datos).toFixed(2);
      this.buscarvar('Desviación estandar muestral', 's', s);
      this.buscarvar('Promedio', 'xbar', xbar);
      this.buscarvar('numero de datos', 'n', n);
    } else {
      this.buscarvar('Desviación estandar muestral', 's', 0);
      this.buscarvar('Promedio', 'xbar', 0);
      this.buscarvar('numero de datos', 'n', n);

    }
  }
  buscarvar(nombre, key, value) {

    let varFind, varFindIndex;
    if (this.item.variables == undefined) {
      this.item.variables = [];
    }
    varFindIndex = this.item.variables.findIndex((x) => x.simbolo == key && x.nombre == nombre);
    varFind = this.item.variables[varFindIndex];
    if (varFind == undefined) {
      this.variablenew = {
        nombre: nombre,
        simbolo: key,
        valor: value,
        manual: true
      };
      this.insertarVariable(this.variablenew);
    } else {
      varFind.valor = value;
      // this.item.variables.splice(varFindIndex, 1);
      // this.item.variables.push(varFind);
      this.insertarVariable(varFind);
    }
  }


}
