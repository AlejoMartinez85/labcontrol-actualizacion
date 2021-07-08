import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { VariableService } from '../../../services/variable/variable.service';
import { ListaGlobal } from '../../../shared/listadosGlobal/listaGlobal';
import { Variable } from '../../../models/variable';
import { variable } from '@angular/compiler/src/output/output_ast';
import { EquipoService } from '../../../services/equipo/equipo.service';
import { ElementoCalibracionService } from '../../../services/elemanto-calibacion/elemento-calibracion.service';
import { NotificationService } from '../../../shared/notification';

@Component({
  selector: 'app-incertidumbre-add',
  templateUrl: './incertidumbre-add.component.html',
  styleUrls: ['./incertidumbre-add.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class IncertidumbreAddComponent implements OnInit {

  form: FormGroup;
  item: Variable;
  formulaactual;
  resultadoEvaluacion = '';
  @Input() variableId: any;
  @Input() parametroId: any;
  parametro: any;
  equipos: any;
  equipoNuevoOpen: boolean;
  equipoSeleccionado: any;
  opcionesVariables: any;
  variableEquipoSel: any;
  elememtoManual = false;
  @ViewChild('mathEditor') mathEditor;
  elementoIncertidumbreEdit: any;
  indexedit: any;
  reload: boolean;
  @Output() endAction = new EventEmitter<any>();
  constructor(private formBuilder: FormBuilder,
    public parametroService: ParametroService,
    private variableService: VariableService,
    private listaGlobal: ListaGlobal,
    private equipoService: EquipoService,
    private elementoCalibracionService: ElementoCalibracionService,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      formula: [],
      isequipo: [],
      equipoId: [],
      variableEquipoId: []
    });
    this.getParametroByID();
    this.getVariableByID();
    this.getEquipos();
  }
  onChangeFormula(result) {
    setTimeout(() => {
      this.resultadoEvaluacion = result;
    });
  }

  getParametroByID() {
    this.reload = false;
    if (this.parametroId != undefined) {
      this.parametroService.getById(this.parametroId).subscribe((parametro) => {
        this.parametro = parametro['parametros'];
        // console.log(this.getParametro);
        this.reload = true;
      });
    }
  }
  getVariableByID() {
    this.variableService.getById(this.variableId).subscribe((result: any) => {
      this.item = result.data;
      this.formulaactual = this.item.formulaCoeficiente;
      if (this.item.equipoId != '') {
        this.getEquipoById({ value: this.item.equipoId });
      }
      this.calcularIncertidumbre();

      // console.log(this.getParametro);
    });
  }
  getEquipos() {
    this.equipoService.getOption(0).subscribe((result: any) => {
      this.equipos = result.data;
    });
  }
  getEquipoById(event) {
    let id;
    id = event.value;
    if (id != undefined) {
      this.equipoService.getById(id).subscribe((result: any) => {
        this.equipoSeleccionado = result.data;
        this.opcionesVariables = this.crearOpcionVariablesEquipo(this.equipoSeleccionado.variables);
        this.getElementosByVariable(this.item.variableEquipoId, this.item.valor);
      });
    }
  }
  crearOpcionVariablesEquipo(variables) {
    const opciones = variables.map(function (item) {

      return { label: item.nombre, value: item._id };
    });
    return opciones;

  }
  equipoNuevo() {
    this.equipoNuevoOpen = true;
  }
  equipoEdit() {
    this.equipoNuevoOpen = true;
  }
  guardarEquipo(value) {
    this.equipoNuevoOpen = false;
    this.getEquipos();

    this.getElementosByVariable(this.item.variableEquipoId, this.item.valor);

  }
  getElementosByVariable(idvariable, varValue) {
    if (this.item.elementosIncertidumbre == undefined) {
      this.item.elementosIncertidumbre = [];
    }
    if (idvariable === undefined) {

      return false;
    }
    this.elementoCalibracionService.get(0, idvariable, varValue).subscribe((result: any) => {
      this.evaluarElementos(result.data);
      this.calcularIncertidumbre();

    });
  }
  evaluarElementos(elementosequipo) {
    let elemmento;
    let resultArray = [];
    for (let i = 0; i < this.item.elementosIncertidumbre.length; i++) {
      elemmento = this.item.elementosIncertidumbre[i];
      if (elemmento.manual == undefined || elemmento.manual == false) {
        var indexElement = elementosequipo.find((x) => x.fuente === elemmento.fuente);
        if (indexElement != undefined) {
          elemmento.nombre = indexElement.nombre;
          elemmento.valor = indexElement.valor;
          resultArray.push(elemmento);
        }

      } else {
        resultArray.push(elemmento);
      }

    }
    for (let i = 0; i < elementosequipo.length; i++) {
      elemmento = elementosequipo[i];
      var indexElement = this.item.elementosIncertidumbre.find((x) => x.fuente === elemmento.fuente);
      if (indexElement == undefined) {

        resultArray.push(elemmento);
      }
    }
    this.item.elementosIncertidumbre = resultArray;
  }
  onSelectVariableEquipo(event) {
    this.getElementosByVariable(event.value, this.item.valor);
  }
  selectElemento(event) {
    this.calcularIncertidumbre();
  }
  calcularIncertidumbre() {
    let incentidumbre;
    incentidumbre = 0;
    for (let i = 0; i < this.item.elementosIncertidumbre.length; i++) {
      let elemento;
      elemento = this.item.elementosIncertidumbre[i];
      if (elemento.seleccionado === true) {
        incentidumbre += elemento.valor ** 2;
      }

    }
    this.item.incertidumbre = Math.sqrt(incentidumbre);
  }
  guardar() {
    if (this.item._id != undefined) {
      this.item.formulaCoeficiente = this.mathEditor.getFormula();
      this.variableService.update(this.item).subscribe((value: any) => {

        this.notificationService.addNotify({ title: 'Alerta', msg: 'Variable actualizada con exito', type: 'success' });
        this.endAction.emit("save");
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }

  }
  agregarElementocAdicional() {
    this.elememtoManual = true;
    this.elementoIncertidumbreEdit = undefined;
    this.indexedit = undefined;
  }
  guardarElemento(event) {
    if (this.item.elementosIncertidumbre == undefined) {
      this.item.elementosIncertidumbre = [];
    }
    if (event == null) {
      this.elememtoManual = false;
    } else if (this.indexedit == undefined) {
      this.item.elementosIncertidumbre.push(event);
      this.elememtoManual = false;
    } else if (this.indexedit != undefined) {
      this.item.elementosIncertidumbre[this.indexedit] = event;
      this.elememtoManual = false;
    }
    this.indexedit = undefined;
  }
  celiminarElementocAdicional(index) {

    this.item.elementosIncertidumbre.splice(index, 1);


  }
  ceditarElementocAdicional(index, elementoIncertidumbre) {
    this.elememtoManual = true;
    this.elementoIncertidumbreEdit = elementoIncertidumbre;
    this.indexedit = index;
  }
}
