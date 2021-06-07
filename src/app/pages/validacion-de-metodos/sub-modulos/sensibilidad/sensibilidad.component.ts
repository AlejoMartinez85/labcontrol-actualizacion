import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NotificationService } from '../../../../shared/notification';
import { linearRegression, linearRegressionLine, rSquared } from 'simple-statistics';
import { Linealidad } from '../../../../models/linealidad';
import { SensibilidadService } from '../../../../services/validacion-demetodos/sensibilidad.service';

@Component({
  selector: 'app-sensibilidad',
  templateUrl: './sensibilidad.component.html',
  styleUrls: ['./sensibilidad.component.scss', '../../../../../assets/icon/icofont/css/icofont.scss']
})
export class SensibilidadComponent implements OnInit {

  @Input() id: string = '';
  @Input() intervalodetrabajoInput: boolean = false;
  @Input() permisosLocal: any;
  @Output() Guardado: EventEmitter<any> = new EventEmitter();
  ArrLinealidad: Linealidad;
  datosArray = [];
  intervalodetrabajo = false;
  guardaLinealidad = false;
  formaLinealidad: FormGroup;
  fomintervalosLinealidad: FormGroup;
  pendienteLinealidad = 0; interceptoLinealidad = 0; RquadradoLinealidad = 0;
  edit: boolean;
  constructor(
    private sensibilidadService: SensibilidadService,
    private fb: FormBuilder,
    private notificationService: NotificationService) {
    this.ArrLinealidad = new Linealidad();
  }
  edicion() {
    if (this.edit) {
      this.edit = false;
    } else {
      this.edit = true;
    }
  }
  ngOnInit() {
    this.formaLinealidad = new FormGroup({
      parametros1: this.fb.array([]),
      parametros2: this.fb.array([]),
      unidad: new FormControl('')
    });
    this.fomintervalosLinealidad = new FormGroup({
      min: new FormControl(0),
      max: new FormControl(0),
      _id: new FormControl(''),
    });
    this.cargarLinealidad();
  }
  // Funciones Generales
  clickBoton(idenificador): void {
    document.getElementById(idenificador).click();
  }

  paste(event, index) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');

    var dd = [];
    row_data.forEach(row_data => {
      if (row_data != "") {
        dd.push(row_data.split('\t'));
      }
    });
    var array1 = [];
    var array2 = [];
    for (let index = 0; index < dd.length; index++) {
      array1.push(dd[index][0]);
      array2.push(dd[index][1]);
    }

    var indexnew = index
    var indexnew2 = index
    var previousvalue = <FormArray>this.formaLinealidad.controls['parametros1']["controls"][index].value;
    array1.forEach(element => {
      indexnew = indexnew + 1
      const control = <FormArray>this.formaLinealidad.controls['parametros1'];
      control.insert(indexnew, this.fb.group({ parametro1: [`${element}`] }));
    })
    array2.forEach(element => {
      indexnew2 = indexnew2 + 1
      const control = <FormArray>this.formaLinealidad.controls['parametros2'];
      control.insert(indexnew2, this.fb.group({ parametro2: [`${element}`] }));
    })

    setTimeout(() => {
      <FormArray>this.formaLinealidad.controls['parametros1']['at'](index).setValue({ parametro1: previousvalue["parametro1"] });
    }, 100);

  }


  data2(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');

    var dd = [];
    row_data.forEach(row_data => {
      if (row_data != "") {
        dd.push(row_data.split('\t'));
      }
    });

    var array1 = [];
    var array2 = [];
    for (let index = 0; index < dd.length; index++) {
      array1.push(dd[index][0]);
      array2.push(dd[index][1]);
    }

    array1.forEach(element => {
      const control = <FormArray>this.formaLinealidad.controls['parametros1'];
      control.push(this.fb.group({ parametro1: [`${element}`] }));
    })
    array2.forEach(element => {
      const control = <FormArray>this.formaLinealidad.controls['parametros2'];
      control.push(this.fb.group({ parametro2: [`${element}`] }));
    })
  }

  addinput(index) {
    const control1 = <FormArray>this.formaLinealidad.controls['parametros1'];
    control1.insert(index + 1, this.fb.group({ parametro1: [``] }));
    const control2 = <FormArray>this.formaLinealidad.controls['parametros2'];
    control2.insert(index + 1, this.fb.group({ parametro2: [``] }));
  }

  llenadoArreglo(arreglo, valores): void {
    switch (arreglo) {
      case 'parametro1':
        valores.forEach(element => {
          const control = <FormArray>this.formaLinealidad.controls['parametros1'];
          control.push(this.fb.group({ parametro1: [`${element}`] }));
        });
        break;
      case 'parametro2':
        valores.forEach(element => {
          const control = <FormArray>this.formaLinealidad.controls['parametros2'];
          control.push(this.fb.group({ parametro2: [`${element}`] }));
        });
        break;
    }
  }

  // Funciones Form
  get parametro1() {
    return this.formaLinealidad.get('parametros1') as FormArray;
  }
  get parametro2() {
    return this.formaLinealidad.get('parametros2') as FormArray;
  }
  removeDato(index: number, array: string) {
    this.eliminarPosicon(index, array);
  }
  eliminarPosicon(index: number, array: string) {
    let control;
    switch (array) {
      case 'parametro1':
        control = <FormArray>this.formaLinealidad.controls['parametros1'];
        control.removeAt(index);
        control = <FormArray>this.formaLinealidad.controls['parametros2'];
        control.removeAt(index);
        break;
      case 'parametro2':
        control = <FormArray>this.formaLinealidad.controls['parametros2'];
        control.removeAt(index);
        control = <FormArray>this.formaLinealidad.controls['parametros1'];
        control.removeAt(index);
        break;
    }
  }
  // Funciones de BD
  cargarLinealidad() {
    this.sensibilidadService.get(this.id).subscribe((resp: any) => {
      console.log("Sensibilidad ", resp)
      if (resp.success) {
        this.formaLinealidad.setValue({
          parametros1 : [],
          parametros2: [],
          unidad: resp.Sensibilidad[0].unidad
        })
        this.ArrLinealidad = resp.Sensibilidad[0];
        this.llenadoArreglo('parametro1', resp.Sensibilidad[0].areras);
        this.llenadoArreglo('parametro2', resp.Sensibilidad[0].concentraciones);
        this.fomintervalosLinealidad.setValue({
          min: resp.Sensibilidad[0].intervaloMinimo,
          max: resp.Sensibilidad[0].intervaloMaximo,
          _id: resp.Sensibilidad[0]._id
        });
        this.clickBoton('btn-Sensibilidad');
      }
    });
  }
  generar(): void {
    document.getElementById('chartSensibilidad').innerHTML = '';
    let chart: ApexCharts;
    this.intervalodetrabajo = true;
    const data = [];
    const puntos = [];
    const puntosmostrar = Array();
    const intervaloMinimo = [];
    const intervaloMaximo = [];
    let lineaRegresion: Function;
    this.ArrLinealidad['concentraciones'] = [];
    this.ArrLinealidad['areras'] = [];
    this.formaLinealidad.value.parametros1.forEach(element => {
      puntos.push(parseFloat(element['parametro1']));
      this.ArrLinealidad['concentraciones'].push(parseFloat(element['parametro1']));
    })
    this.formaLinealidad.value.parametros2.forEach(element => {
      data.push(parseFloat(element['parametro2']));
      this.ArrLinealidad['areras'].push(parseFloat(element['parametro2']));
    });
    this.formaLinealidad.value.parametros2.forEach((element, index) => {
      if (this.fomintervalosLinealidad.value.min !== '') {
        intervaloMinimo.push(this.fomintervalosLinealidad.value.min);
      }
      if (this.fomintervalosLinealidad.value.max !== '') {
        intervaloMaximo.push(this.fomintervalosLinealidad.value.max);
      }
      puntosmostrar.push([puntos[index], data[index]]);
    });
    lineaRegresion = linearRegressionLine(linearRegression(puntosmostrar));
    this.pendienteLinealidad = linearRegression(puntosmostrar)['m'];
    this.interceptoLinealidad = linearRegression(puntosmostrar)['b'];
    this.RquadradoLinealidad = rSquared(puntosmostrar, linearRegressionLine(linearRegression(puntosmostrar)));
    console.log(intervaloMinimo);
    console.log(intervaloMaximo);
    let options = {};
    options = {
      series: [{
        name: 'Concentración',
        data: puntosmostrar
      }],
      chart: {
        height: 350,
        type: 'line',
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      grid: {
        padding: {
          right: 30,
          left: 20
        }
      },
      title: {
        text: '',
        align: 'left'
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: function (val) {
            return parseFloat(val).toFixed(1)
          }
        }
      },
      xaxis: {
        tickAmount: 10,
        labels: {
          formatter: function (val) {
            return parseFloat(val).toFixed(1)
          }
        }
      }
    };
    chart = new ApexCharts(document.querySelector('#chartSensibilidad'), options);
    chart.render();
    this.guardaLinealidad = true;
    const array = {...this.ArrLinealidad};
    array['pendiente'] = this.pendienteLinealidad;
    array['intercepto'] = this.interceptoLinealidad;
    array['rquadrado'] = this.RquadradoLinealidad;
    const Sensibilidad = {
      guardado:false,
      sensibilidad: true,
      arr: array   
    };
    this.Guardado.emit(Sensibilidad)
  }
  guardarLinealidad(): void {
    // this.llenadoVariableValidacion(this.formainformacion, this.formaTablaBancoMuestras)
    this.ArrLinealidad['intervaloMinimo'] = this.fomintervalosLinealidad.value.min;
    this.ArrLinealidad['intervaloMaximo'] = this.fomintervalosLinealidad.value.max;
    this.ArrLinealidad['id_validacionMetodo'] = this.id;
    this.ArrLinealidad['unidad'] = this.formaLinealidad.value.unidad;
    if (this.fomintervalosLinealidad.value._id === '') {
      this.sensibilidadService.create(this.ArrLinealidad).subscribe((resp: any) => {
        console.log(resp);
        if (resp.success) {
          const Sensibilidad = {
            guardado:true,
            sensibilidad: true,
            arr: resp.LinealidadStored  
          };
          this.Guardado.emit(Sensibilidad)
          this.ArrLinealidad = resp.LinealidadStored;
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
          console.log(this.ArrLinealidad);
        } else {
          const respuesta = {
            guardado:false,
            sensibilidad: true,
            arr: [] 
          }
          this.Guardado.emit(respuesta);
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'error' });
        }
      });
    } else {
      this.sensibilidadService.edit(this.ArrLinealidad).subscribe((resp: any) => {
        console.log(resp);
        if (resp.success) {
          const Sensibilidad = {
            guardado:true,
            sensibilidad: true,
            arr: resp.LinealidadStored  
          };
          this.Guardado.emit(Sensibilidad)
          this.ArrLinealidad = resp.linealidad;
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
        } else {
          const respuesta = {
            guardado:false,
            sensibilidad: false,
            arr: []
          }
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'error' });
          this.Guardado.emit(respuesta);
        }
      });
    }
  }
  EliminarLinealidad() {
    this.sensibilidadService.delete(this.ArrLinealidad._id).subscribe((resp: any) => {
      if (resp.success) {
        this.notificationService.addNotify({ title: 'Linealidad', msg: resp.message, type: 'success' });
        location.reload();
      } else {
        this.notificationService.addNotify({ title: 'Linealidad', msg: resp.message, type: 'error' });
      }
    });
  }

}
