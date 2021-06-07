import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LinealidadService } from '../../../../services/validacion-demetodos/linealidad.service';
import { NotificationService } from '../../../../shared/notification';
import { linearRegression, linearRegressionLine, rSquared } from 'simple-statistics';
import { Linealidad } from '../../../../models/linealidad';


@Component({
  selector: 'app-linealidad',
  templateUrl: './linealidad.component.html',
  styleUrls: ['./linealidad.component.scss', '../../../../../assets/icon/icofont/css/icofont.scss']
})
export class LinealidadComponent implements OnInit {
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
  helperActive: boolean = false;
  helper: string;
  constructor(
    private linealidadService: LinealidadService,
    private fb: FormBuilder,
    private notificationService: NotificationService) {
    this.ArrLinealidad = new Linealidad();
    this.edit = false;
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


  paste(event, index, name) {
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
    var previousvalue2 = <FormArray>this.formaLinealidad.controls['parametros2']["controls"][index].value;

    if (dd[0][0].length == 1) {
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
    } else {
      if (name == "parametro1") {
        array1.forEach(element => {
          indexnew = indexnew + 1
          const control = <FormArray>this.formaLinealidad.controls['parametros1'];
          control.insert(indexnew, this.fb.group({ parametro1: [`${element}`] }));
        })
      } else {
        array1.forEach(element => {
          indexnew2 = indexnew2 + 1
          const control = <FormArray>this.formaLinealidad.controls['parametros2'];
          control.insert(indexnew2, this.fb.group({ parametro2: [`${element}`] }));
        })
      }
    }



    setTimeout(() => {
      <FormArray>this.formaLinealidad.controls['parametros1']['at'](index).setValue({ parametro1: previousvalue["parametro1"] });
      <FormArray>this.formaLinealidad.controls['parametros2']['at'](index).setValue({ parametro2: previousvalue2["parametro2"] });
    }, 100);

  }


  data2(event: ClipboardEvent, name) {
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

    if (dd[0][0].length == 1) {
      array1.forEach(element => {
        const control = <FormArray>this.formaLinealidad.controls['parametros1'];
        control.push(this.fb.group({ parametro1: [`${element}`] }));
      })
      array2.forEach(element => {
        const control = <FormArray>this.formaLinealidad.controls['parametros2'];
        control.push(this.fb.group({ parametro2: [`${element}`] }));
      })
    } else {
      if (name == "parametro1") {
        array1.forEach(element => {
          const control = <FormArray>this.formaLinealidad.controls['parametros1'];
          control.push(this.fb.group({ parametro1: [`${element}`] }));
        })
      } else {
        array1.forEach(element => {
          const control = <FormArray>this.formaLinealidad.controls['parametros2'];
          control.push(this.fb.group({ parametro2: [`${element}`] }));
        })
      }
    }


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

  edicion() {
    if (this.edit) {
      this.edit = false;
    } else {
      this.edit = true;
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
    this.linealidadService.get(this.id).subscribe((resp: any) => {
      if (resp.success) {
        if ( resp.Linealidad.length > 0) {

          this.ArrLinealidad = resp.Linealidad[0];
          this.formaLinealidad.setValue({
            parametros1:[],
            parametros2:[],
            unidad: this.ArrLinealidad.unidad
          })
          this.llenadoArreglo('parametro1', this.ArrLinealidad.areras);
          this.llenadoArreglo('parametro2', this.ArrLinealidad.concentraciones);
          this.fomintervalosLinealidad.setValue({
            min: this.ArrLinealidad.intervaloMinimo,
            max: this.ArrLinealidad.intervaloMaximo,
            _id: this.ArrLinealidad._id
          });
          this.clickBoton('btn-linealidad');
          
        }
      }
    });
  }
  generar(): void {
    document.getElementById('chart').innerHTML = '';
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


    let imin =  this.ArrLinealidad['concentraciones'].indexOf(Math.min(...this.ArrLinealidad['concentraciones']));
    let imax =  this.ArrLinealidad['concentraciones'].indexOf(Math.max(...this.ArrLinealidad['concentraciones']));


    
    var primerapareja = puntosmostrar[imin];
    var ultimapareja = puntosmostrar[imax]
    var xprimeraPareja = primerapareja[0];
    var xultimaPareja = ultimapareja[0];
    lineaRegresion = linearRegressionLine(linearRegression(puntosmostrar));
    this.pendienteLinealidad = linearRegression(puntosmostrar)['m'];
    this.interceptoLinealidad = linearRegression(puntosmostrar)['b'];
    this.RquadradoLinealidad = rSquared(puntosmostrar, linearRegressionLine(linearRegression(puntosmostrar)));
    var yregprimera = this.pendienteLinealidad*xprimeraPareja + this.interceptoLinealidad;
    var yregultima = this.pendienteLinealidad*xultimaPareja + this.interceptoLinealidad;
    var primeraMatriz=[];
    primeraMatriz.push([xprimeraPareja,yregprimera],[xultimaPareja,yregultima]);
    let options = {};
    options = {
      series: [{
        name: 'Valores experimentales',
        type: 'scatter',
        data: puntosmostrar
      }, {
        name: 'Regresión lineal',
        type: 'line',
        data: primeraMatriz
      }],
      chart: {
        height: 350,
        type: 'line',
      },
      fill: {
        type: 'solid',
      },
      markers: {
        size: [6, 0]
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        dashArray: [0, 8, 5]
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
    chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();
    this.guardaLinealidad = true;
    const array  = {...this.ArrLinealidad}
    array['pendiente'] = this.pendienteLinealidad
    array['intercepto'] = this.interceptoLinealidad
    array['Rquadrado'] = this.RquadradoLinealidad
    const LinealidadResult = {
      guardado:false,
      linealidad: true,
      arr: array
    };
    this.Guardado.emit(LinealidadResult);
  }
  guardarLinealidad(): void {
    // this.llenadoVariableValidacion(this.formainformacion, this.formaTablaBancoMuestras)
    this.ArrLinealidad['intervaloMinimo'] = this.fomintervalosLinealidad.value.min;
    this.ArrLinealidad['intervaloMaximo'] = this.fomintervalosLinealidad.value.max;
    this.ArrLinealidad['unidad'] = this.formaLinealidad.value.unidad;
    this.ArrLinealidad['id_validacionMetodo'] = this.id;
    if (this.fomintervalosLinealidad.value._id === '') {
      this.linealidadService.create(this.ArrLinealidad).subscribe((resp: any) => {
        if (resp.success) {
          this.ArrLinealidad = resp.LinealidadStored;
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
          const LinealidadResult = {
            guardado:true,
            linealidad: true,
            arr: this.ArrLinealidad   
          };
          this.Guardado.emit(LinealidadResult);
        } else {
          const LinealidadResult = {
            guardado:false,
            linealidad: false,
            arr: []   
          };
          this.Guardado.emit(LinealidadResult);
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'error' });
        }
      });
    } else {
      this.linealidadService.edit(this.ArrLinealidad).subscribe((resp: any) => {
        if (resp.success) {
          this.ArrLinealidad = resp.linealidad;
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
          const LinealidadResult = {
            guardado:true,
            linealidad: true,
            arr: this.ArrLinealidad   
          };
          this.Guardado.emit(LinealidadResult);
        } else {
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'error' });
          const LinealidadResult = {
            guardado:false,
            linealidad: false,
            arr: []   
          };
          this.Guardado.emit(LinealidadResult);
        }
      });
    }
  }
  EliminarLinealidad() {
    this.linealidadService.delete(this.ArrLinealidad._id).subscribe((resp: any) => {
      if (resp.success) {
        this.notificationService.addNotify({ title: 'Linealidad', msg: resp.message, type: 'success' });
        location.reload();
      } else {
        this.notificationService.addNotify({ title: 'Linealidad', msg: resp.message, type: 'error' });
      }
    });
  }
  help(type: string){
    this.helperActive = true;
    switch (type) {
      case '1':
        this.helper = '1';
    
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        break;
      case '2':
        this.helper = '2';
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
        break
      case '3':
      this.helper = '3';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '4':
      this.helper = '4';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '5':
      this.helper = '5';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '6':
      this.helper = '6';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '7':
      this.helper = '7';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '8':
      this.helper = '8';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
    }
  }

}
