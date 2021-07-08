import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListaGlobal } from '../../../shared/listadosGlobal/listaGlobal';
import { Equipo } from '../../../models/equipo';
import { PuntoCalibracion } from '../../../models/puntoCalibracion';
import { Variable } from '../../../models/variable';
import { ValorRepetibilidad } from '../../../models/ValorRepetibilidad';
import { ValorCurvaCalibracion } from '../../../models/ValorCurvaCalibracion';
import { EquipoService } from '../../../services/equipo/equipo.service';
import { NotificationService } from '../../../shared/notification';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-equipo-add',
  templateUrl: './equipo-add.component.html',
  styleUrls: ['./equipo-add.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class EquipoAddComponent implements OnInit, OnChanges {
  item: any;
  form: FormGroup;
  puntoCalibracion: PuntoCalibracion;
  formVar: FormGroup;
  formsvars = [];
  variablenew: Variable;
  valorRepetibilidadNew: ValorRepetibilidad;
  valorCurvaCalibracion: any;
  @Input() equipoedit: any;
  @Output() endAction = new EventEmitter<string>();
  constructor(private formBuilder: FormBuilder,
    private listaGlobal: ListaGlobal,
    private equipoService: EquipoService,
    private notificationService: NotificationService) {
    this.item = new Equipo();
    this.variablenew = new Variable();
    this.variablenew.kcertificado = 2;
    if (this.item.variables == undefined) {
      this.item.variables = [];
    }


    this.puntoCalibracion = {
      objetivo: '',
      error: 0,
      incertidumbre: 0
    };
    this.puntoCalibracion = new PuntoCalibracion();
    this.valorRepetibilidadNew = new ValorRepetibilidad();
    this.valorCurvaCalibracion = new ValorCurvaCalibracion();
  }


  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: [null, Validators.required],
      variables: new FormArray([])
    });
    if (this.equipoedit != undefined || this.equipoedit != 0) {
      this.getEquipoById(this.equipoedit);
    }

  }
  clearFilter(){
    const tipoFrecuencia =  this.item.variables[0].tipofrecuencia
    this.calcularproximafecha(this.item.variables[0], tipoFrecuencia)
  }
  getEquipoById(id) {

    if (id != undefined) {
      this.equipoService.getById(id).subscribe((result: any) => {
        this.item = result.data;
        console.log(this.item)
        let diferencia = this.item.variables.length - this.t.length;
        for (var i = 0; i < this.item.variables.length; i++) {
          this.item.variables[i].ultcalibracion = moment(this.item.variables[i].ultcalibracion).format('YYYY-MM-DD');
        }
        if (diferencia > 0) {
          for (let i = 0; i < diferencia; i++) {
            this.agregarControles(i);
          }
        }

      });
    }
  }
  calcularproximafecha(variable, event) {
    console.log(event)
    let valor;
    if ( event.value ==! undefined) {
      valor = event.value;
    } else {
      valor = event;
    }
    if (valor == 'Dias') {
      variable.proxcalibracion = moment(variable.ultcalibracion).add(variable.frecalibracion, 'days');
    } else if (valor == 'Semanas') {
      variable.proxcalibracion = moment(variable.ultcalibracion).add(variable.frecalibracion, 'week');
    } else if (valor == 'Meses') {
      variable.proxcalibracion = moment(variable.ultcalibracion).add(variable.frecalibracion, 'months');
    } else if (valor == 'Año') {
      variable.proxcalibracion = moment(variable.ultcalibracion).add(variable.frecalibracion, 'years');
    }
  }
  agregarControles(i) {
    let group;
    group = {};
    group['nombre_' + i] = [null, Validators.required];
    group['resolucion_' + i] = ['', []];
    group['tipodistribucion_' + i] = ['', []];
    group['escalibrado_' + i] = ['', []];
    group['esrepetibilidad_' + i] = ['', []];
    group['escurvacalibracion_' + i] = ['', []];
    group['ultcalibracion_' + i] = ['', []];
    group['frecalibracion_' + i] = ['', []];
    group['tipofrecuencia_' + i] = ['', []];
    group['kcertificado_' + i] = ['', []];
    group['numeroReplicas_' + i] = ['', []];
    group['valortipodist_' + i] = ['', []];
    const formvar = this.formBuilder.group(group);
    this.t.push(formvar);

  }
  // convenience getters for easy access to form fields
  get f() { return this.form ? this.form.controls : null; }
  get t() { return this.f.variables as FormArray; }
  public getFormVar(i) { return this.t.controls[i] as FormGroup; }

  getControlVar(i, name) {
    let formgroup;

    formgroup = this.t.controls[i] as FormGroup;
    return formgroup.controls[name];
  }

  agregarPuntoCalibracion(variable) {

    if (variable.puntoscalibracion == undefined) {
      variable.puntoscalibracion = [];
    }
    variable.puntoscalibracion.push({ ...this.puntoCalibracion });
    this.puntoCalibracion = new PuntoCalibracion();
  }

  agregarValorRepetibilidad(variable) {

    if (variable.valoresRepetibilidad == undefined) {
      variable.valoresRepetibilidad = [];
    }
    variable.valoresRepetibilidad.push({ ...this.valorRepetibilidadNew });
    this.valorRepetibilidadNew = new ValorRepetibilidad();
  }
  agregarValorCurvaCalibracion(variable) {

    if (variable.valoresCurvaCalibracion == undefined) {
      variable.valoresCurvaCalibracion = [];
    }
    variable.valoresCurvaCalibracion.push({ ...this.valorCurvaCalibracion });
    this.valorCurvaCalibracion = new ValorCurvaCalibracion();
  }
  celiminarCurvaCalibracion(variable, index) {
    variable.valoresCurvaCalibracion.splice(index, 1);

  }
  celiminarrepetibiliad(variable, index) {
    variable.valoresRepetibilidad.splice(index, 1);
  }
  celiminarPuntoCalibracion(variable, index) {
    variable.puntoscalibracion.splice(index, 1);
  }
  agregarVariable() {

    this.item.variables.push({ ...this.variablenew });
    let i;
    i = this.item.variables.length - 1;
    this.agregarControles(i);
  }
  beforeChange(tab) {
    console.log(tab);
  }

  getnamecontrol(name, i) {
    return `${name}_${i}`;
  }
  guardar(event) {
    if (this.equipoedit != undefined) {
      this.equipoService.update(this.item).subscribe((value: any) => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Equipo almacenado con exito', type: 'success' });
        console.log(this.item)
        this.endAction.emit('ok');
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    } else {
      console.log(this.item)
      this.equipoService.add(this.item).subscribe((value: any) => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Equipo almacenado con exito', type: 'success' });
        this.endAction.emit('ok');
      }, err => {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
      });
    }
  }
  closeMyModalbtn($event) {
    this.endAction.emit('close');
  }
  ngOnChanges(changes: SimpleChanges) {

    if (this.equipoedit != undefined) {
      if (this.f == null) {
        this.form = this.formBuilder.group({
          nombre: [null, Validators.required],
          variables: new FormArray([])
        });
      }
      console.log('CAMBIO');
      // changes.prop contains the old and the new value...
      this.equipoedit = changes.equipoedit.currentValue;
      this.getEquipoById(this.equipoedit);
      this.f.variables = new FormArray([]);
    }
  }
  celiminarvar(index){
    swal({
      title: 'Alerta!',
      text: 'Realmente desea eliminar el equipo? Esta acción sera permanente',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then((result: any) => {
      if (result.value) {
        this.item.variables.splice(index,1);
      }
    });

  }
}
