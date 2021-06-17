import { Component, OnInit, Pipe, AfterViewInit, ViewChild } from '@angular/core';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AlertasService } from '../../../services/aletas/alertas.service';
import { NotificationService } from '../../../shared/notification/notification.service';
import { VariablesConfiguracionService } from '../../../services/variables-configuracion/variables-configuracion.service';
import { mean, sampleStandardDeviation, min, max, linearRegression, linearRegressionLine, rSquared, sum } from 'simple-statistics';
import { animate, style, transition, trigger } from '@angular/animations';
import { Parametro } from '../../../models/parametro';
import { VariableService } from '../../../services/variable/variable.service';
import * as $ from 'jquery';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { OpcionesIncertidumbre } from '../../../models/OpcionesIncertidumbre';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';

@Component({
  selector: 'app-ver-parametro',
  templateUrl: './ver-parametro.component.html',
  styleUrls: ['./ver-parametro.component.scss',
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
export class VerParametroComponent implements OnInit, AfterViewInit {


  opcionesIncertidumbre = OpcionesIncertidumbre;
  form: FormGroup; formaAlertas: FormGroup; formaAlertasAdd: FormGroup; resultado: string; getParametro = []; tercero: string;
  alertasParametros = []; variablesResultado = []; alertaEspesifica = []; $identificador; configuracionAvanzada = false;
  resolucion = false; variablesCalculo = false; equipoCalibracion = false; datosArray = []; formaIncertidumbre: FormGroup;
  regrecionB0 = 0; regrecionB1 = 0; xPromedio = 0; nDatos = 0; sCurva = 0; SSx = 0; incertidumbreCalculos = 0;
  regrecion = false; errorElevado2 = []; Sxvado2 = []; Repetibilidad = false; vCalculo = false; tipoA = false; tipoB = false;
  tipobAdd = false; tipoAAdd = false;
  item: Parametro;
  opcion = 0;
  variablenew = { simbolo: '', valor: '' };
  formulaactual: String = "";
  @ViewChild('mathEditor') mathEditor;
  reload: boolean;
  resultadoEvaluacion = '';
  subscription: any;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  user: any;
  constructor(
    public parametroService: ParametroService,
    private router: ActivatedRoute,
    public alertas: AlertasService,
    public valiriablesConfiguracion: VariablesConfiguracionService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private variableService: VariableService,
    private rolesPermisosServices: RolesPermisosService) {

    this.$identificador = this.router.snapshot.paramMap.get('id');
    this.item = new Parametro();
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.Permisos = new Permisos();
    if (localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.Paramertros[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe((resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.Paramertros[0];
          console.log(this.permisosLocal);
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  ngAfterViewInit() {
    // $.getScript('assets/mathquill-0.10.1/mathquill.min.js')
    //   .done(function (script, textStatus) {
    //     console.log(textStatus);
    //   })
    //   .fail(function (jqxhr, settings, exception) {
    //     console.log(exception);
    //   });
  }
  ngOnInit() {
    this.reload = true;
    this.cargarAlertas();
    this.getbyID();
    this.valiriablesConfiguracion.get(this.$identificador).subscribe((variables) => {
      this.variablesResultado = variables;
    });
    this.cargarFormAlertas();
    this.cargarFormAlertasAdd();
    this.formaIncertidumbre = new FormGroup({
      nombre: new FormControl(''),
      resolucionEquipo: new FormControl(false),
      equipoCalibrado: new FormControl(false),
      calcularRepetitibilidad: new FormControl(false),
      configuracionAvanzada: new FormControl(false),
      concentracion: new FormControl(''),
      concentraciones: this.fb.array([]),
      areas: this.fb.array([]),
    });
    this.form = this.fb.group({
      simbolo: [null, Validators.required],
      unidad: [null, Validators.required],
      formula: [null, Validators.required],
    });
    this.subscription = {};
  }
  getbyID() {
    if (this.$identificador != undefined) {
      this.parametroService.getById(this.$identificador).subscribe((parametro) => {
        this.tercero = parametro['parametros']['tercero'];
        this.getParametro = parametro['parametros'];
        this.item = parametro['parametros'];
        this.formulaactual = this.item.formula;
        // console.log(this.getParametro);
      });
    }
  }
  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }
  cargarModal() {
    document.querySelector('#modal-generico-metodo-formula').classList.add('md-show');
  }
  guardarResultado() {
    document.querySelector('#modal-generico-metodo-formula').classList.remove('md-show');
    document.querySelector('#modal-generico-ensayo').classList.add('md-show');
  }
  onSubmit(val) {
    console.log(this.form);
  }
  mostratFormEditar(formulario) {
    document.querySelector('.' + formulario).classList.remove('d-none');
  }
  ocultarFormEditar(formulario) {
    document.querySelector('.' + formulario).classList.add('d-none');
  }
  // Alertas crud

  cargarAlertas() {
    this.alertas.get(this.$identificador).subscribe(alertas => {
      this.alertasParametros = alertas
      // console.log(this.alertasParametros);
    });
  }

  cargarFormAlertasAdd() {
    this.formaAlertasAdd = new FormGroup({
      campo1_EDIT: new FormControl(null, Validators.required),
      condicion_EDIT: new FormControl(null, Validators.required),
      campo2_EDIT: new FormControl(null, Validators.required),
      campo1_id_EDIT: new FormControl(null, Validators.required),
      campo2_id_EDIT: new FormControl(null, Validators.required),
      descripocion_EDIT: new FormControl(null, Validators.required),
      id_pareametros: new FormControl(null, Validators.required)
    });
  }

  cargarFormAlertas() {
    this.formaAlertas = new FormGroup({
      campo1: new FormControl(null, Validators.required),
      condicion: new FormControl(null, Validators.required),
      campo2: new FormControl(null, Validators.required),
      campo1_id: new FormControl(null, Validators.required),
      campo2_id: new FormControl(null, Validators.required),
      descripocion: new FormControl(null, Validators.required)
    });
  }

  editarAlertas(element) {
    const campo1 = this.formaAlertas.value['campo1'].split('-');
    const campo2 = this.formaAlertas.value['campo2'].split('-');
    this.formaAlertas.setValue({
      campo1: campo1[0],
      campo1_id: campo1[1],
      campo2: campo2[0],
      campo2_id: campo2[1],
      condicion: this.formaAlertas.value['condicion'],
      descripocion: this.formaAlertas.value['descripocion']
    });
    this.alertas.update(element, this.formaAlertas.value).subscribe(alerta => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Alerta Editada con exito', type: 'success' });
      this.cargarAlertas();
    });
  }

  eliminarAlerta(element) {
    this.alertas.delete(element._id, element).subscribe(value => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Alerta eliminada con exito', type: 'success' });
      this.cargarAlertas();
    });
  }

  agregarAlerta() {
    const campo1_EDIT = this.formaAlertasAdd.value['campo1_EDIT'].split('-');
    const campo2_EDIT = this.formaAlertasAdd.value['campo2_EDIT'].split('-');
    this.formaAlertasAdd.setValue({
      campo1_EDIT: campo1_EDIT[0],
      condicion_EDIT: this.formaAlertasAdd.value['condicion_EDIT'],
      campo2_EDIT: campo2_EDIT[0],
      campo1_id_EDIT: campo1_EDIT[1],
      campo2_id_EDIT: campo2_EDIT[1],
      descripocion_EDIT: this.formaAlertasAdd.value['descripocion_EDIT'],
      id_pareametros: this.$identificador
    });

    console.log(this.formaAlertasAdd);

    this.alertas.add(this.formaAlertasAdd.value).subscribe(alerta => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Alerta eliminada con exito', type: 'success' });
      this.cargarAlertas();
      this.formaAlertasAdd.reset();
    });
  }
  // Variables

  deleteVariable(val) {
    console.log(val);
  }

  checkValorVariable(event, id) {
    const valores = {
      id_valor: id,
      campo: event['target'].value
    };
    const config = {
      valor: event['target'].value
    };
    this.alertas.editAlertaValor(valores).subscribe(resp => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Alerta Editada con exito', type: 'success' });
      this.cargarAlertas();
    });
    this.valiriablesConfiguracion.updateValor(id, config).subscribe(variable => {
      this.notificationService.addNotify({ title: 'Variable de Configuración', msg: 'Variable Editada con exito', type: 'success' });
    })
  }

  muestraCollapse(tipo: string): void {
    switch (tipo) {
      case 'tipoA':
        if (this.tipoA) {
          this.tipoA = false;
        } else {
          this.tipoA = true;
          this.tipoB = false;
        }
        break;
      case 'tipoB':
        if (this.tipoB) {
          this.tipoB = false;
        } else {
          this.tipoB = true;
          this.tipoA = false;
        }
        break;
    }
  }

  configAdvanced(event, op: string) {
    switch (op) {
      case 'op1':
        if (event.target.checked) {
          this.resolucion = true;
        } else {
          this.resolucion = false;
        }
        break;
      case 'op2':
        if (event.target.checked) {
          this.equipoCalibracion = true;
          console.log(this.equipoCalibracion);
        } else {
          console.log(this.equipoCalibracion);
          this.equipoCalibracion = false;
        }
        break;
      case 'op3':
        if (event.target.checked) {
          this.Repetibilidad = true;
        } else {
          this.Repetibilidad = false;
        }
        break;
      case 'op4':
        if (event.target.checked) {
          this.configuracionAvanzada = true;
        } else {
          this.configuracionAvanzada = false;
        }
        break;
      case 'op5':
        if (event.target.checked) {
          this.variablesCalculo = true;
        } else {
          this.variablesCalculo = false;
        }
        break;
      case 'op6':
        if (event.target.checked) {
          this.vCalculo = true;
        } else {
          this.vCalculo = false;
        }
        break;
    }
  }
  data(event: ClipboardEvent, array: string) {
    this.datosArray = [];
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');
    row_data.forEach((valor, index) => {
      valor = valor.replace(',', '.');
      this.datosArray.push(parseFloat(valor));
    });
    this.llenadoArreglo(array, this.datosArray);
  }
  llenadoArreglo(arreglo, valores) {
    switch (arreglo) {
      case 'concentracion':
        valores.forEach(element => {
          const control = <FormArray>this.formaIncertidumbre.controls['concentraciones'];
          control.push(this.fb.group({ concentracion: [`${element}`] }));
        });
        break;
      case 'area':
        valores.forEach(element => {
          const control = <FormArray>this.formaIncertidumbre.controls['areas'];
          control.push(this.fb.group({ area: [`${element}`] }));
        });
        break;
    }
  }
  removeDato(index: number, array: string) {
    this.eliminarPosicon(index, array);
  }
  eliminarPosicon(index: number, array: string) {
    let control;
    switch (array) {
      case 'concentracion':
        control = <FormArray>this.formaIncertidumbre.controls['concentraciones'];
        control.removeAt(index);
        break;
      case 'area':
        control = <FormArray>this.formaIncertidumbre.controls['areas'];
        control.removeAt(index);
        break;
    }
  }
  get concentracion() {
    return this.formaIncertidumbre.get('concentraciones') as FormArray;
  }
  get area() {
    return this.formaIncertidumbre.get('areas') as FormArray;
  }

  guardarFormIncertidumbre() {
    const concentracion = this.formaIncertidumbre.value.concentracion;
    const concentraciones = [];
    const areas = [];
    const puntosmostrar = Array();
    const xPromedio = []
    this.formaIncertidumbre.value.concentraciones.forEach(element => {
      concentraciones.push(parseFloat(element['concentracion']));
    });
    this.formaIncertidumbre.value.areas.forEach(element => {
      areas.push(parseFloat(element['area']));
    });
    this.formaIncertidumbre.value.areas.forEach((element, index) => {
      puntosmostrar.push([concentraciones[index], areas[index]]);
    });
    this.regrecionB0 = linearRegression(puntosmostrar)['b'];
    this.regrecionB1 = linearRegression(puntosmostrar)['m'];

    if (puntosmostrar.length > 0) {
      this.regrecion = true;
    }
    this.xPromedio = mean(concentraciones);
    this.nDatos = this.formaIncertidumbre.value.concentraciones.length;
    concentraciones.forEach(element => {
      this.Sxvado2.push(Math.pow((Math.abs(element - this.xPromedio)), 2));
    });
    puntosmostrar.forEach(element => {
      this.errorElevado2.push(Math.pow((this.regrecionB0 + (this.regrecionB1 * element[0]) - element[1]), 2));
    });
    this.sCurva = Math.sqrt(sum(this.errorElevado2) / Math.abs(this.nDatos - 2));
    this.SSx = sum(this.Sxvado2);
    this.incertidumbreCalculos = ((this.sCurva / this.regrecionB1) * Math.sqrt(1 + (1 / this.nDatos) + (Math.pow((concentracion - this.xPromedio), 2) / this.SSx)))
    console.log('datos (n) ', this.nDatos);
    console.log('regrecionB0 ', this.regrecionB0);
    console.log('regrecionB1 ', this.regrecionB1);
    console.log('errorElevado2 ', this.errorElevado2);
    console.log('Sxvado2 ', this.Sxvado2);
    console.log('XPromedio ', this.xPromedio);
    console.log('S curva ', this.sCurva);
    console.log('SSx ', this.SSx);
    console.log('Incertidumbre ', this.incertidumbreCalculos);
  }
  verOpcion(opcion) {
    this.opcion = opcion;
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
    this.item.formula = this.mathEditor != undefined ? this.mathEditor.getFormula() : this.formulaactual;
    this.formulaactual = this.item.formula;
    if (variable._id != undefined) {
      if (this.subscription[variable._id]) {
        this.subscription[variable._id].unsubscribe();
      }
      this.subscription[variable._id] = this.variableService.update(variable).subscribe((value) => {
        this.variablenew = { simbolo: '', valor: '' };
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Variable registrada con exito', type: 'success' });
        this.reload = true;
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    } else {
      this.variableService.add(variable).subscribe((value: any) => {
        this.variablenew = { simbolo: '', valor: '' };
        this.item.variables.push(value.data);
        this.reload = true;
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Variable registrada con exito', type: 'success' });
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });

    }
  }
  eliminarVariable(variable) {
    this.reload = false;
    this.variableService.delete(variable._id, variable).subscribe((value) => {
      this.variablenew = { simbolo: '', valor: '' };
      let varfind = this.item.variables.findIndex((x) => x._id === variable._id);
      if (varfind != -1) {
        this.item.variables.splice(varfind, 1);
      }

      this.reload = true;
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Variable elimianda con exito', type: 'success' });
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  actualizarItem() {
    this.reload = false;
    this.item.formula = this.mathEditor.getFormula();
    this.parametroService.update(this.item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Parametro actualizado con exito', type: 'success' });
      this.reload = true;
      this.formulaactual = this.item.formula;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }
  onChangeFormula(result) {
    setTimeout(() => {
      this.resultadoEvaluacion = result;
      this.item.formula = this.mathEditor.getFormula();
    });
  }

  beforeChange($event: NgbTabChangeEvent) {

  }
  refreshParametro(event) {
    this.getbyID();
  }
}
