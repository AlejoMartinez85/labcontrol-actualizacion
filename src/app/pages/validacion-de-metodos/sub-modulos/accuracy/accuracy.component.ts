import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _  from 'lodash';

/* Models */
import { Accuracy } from '../../../../models/Accuracy';

/* Services */
import { AccuracyService } from '../../../../services/accuracy/accuracy.service';
import { NotificationService } from '../../../../shared/notification/notification.service';

@Component({
  selector: 'app-accuracy',
  templateUrl: './accuracy.component.html',
  styleUrls: ['./accuracy.component.scss', '../../../../../assets/icon/icofont/css/icofont.scss']
})
export class AccuracyComponent implements OnInit {
  
  @Input() id: string;
  @Input() permisosLocal: any;
  @Input() validacion: any;
  @Output() Guardado: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  matrixArray: FormArray;
  maskA = [];
  maskR = [];

  accuracy: Accuracy = {};
  showEdit = false;

  loader = false;

  helperActive: boolean = false;
  helper: string;

  constructor(
    private fb: FormBuilder,
    private accuracyService: AccuracyService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.getAccuracyFromAPi();
    this.build();
  }

  private async getAccuracyFromAPi(): Promise<void> {
    try {
      if (this.loader) {return;};
      this.loader = true;
      const response = await this.accuracyService.getByValidationMethod(this.id);
      this.accuracy = response.accuracy || {};
      if (this.permisosLocal.editar) {
        this.showEdit = !(this.accuracy._id != undefined);
      }
      const Accuracy = {
        guardado: false,
        presociones: true,
        arr: response.accuracy
      }
      this.Guardado.emit(Accuracy)
    } catch (error) {
      console.warn('Error@accuracy.component@getAccuracyFromAPi', error);
    }
    this.loader = false;
  }

  public showEditEvent(): void {
    if (this.permisosLocal.editar) {
      this.showEdit = !this.showEdit;
    }
  }

  private build(): void {
    this.form = this.fb.group({
      analysts: [this.accuracy.analysts || 0, Validators.compose([Validators.required])],
      replicas: [this.accuracy.replicas || 0, Validators.compose([Validators.required])],
      unidad: [this.accuracy.unidad || ''],
      matrix: this.prepareMatrixControls(this.fb.array([], Validators.compose([Validators.required])))
    });

    this.prepareMask();
  }

  private prepareMatrixControls(formArray: FormArray) {
    const matrix = this.accuracy.matrix || [];
    for (const record of matrix) {      
      const group = this.fb.group({});
      for (const key in record) {
        if (Object.prototype.hasOwnProperty.call(record, key)) {
          group.addControl(key, 
            this.fb.control(record[key], Validators.compose([Validators.required]))
          );
        }
      }
      formArray.push(group);
    }
    this.matrixArray = formArray;
    console.log(this.matrixArray);
    return formArray;
  }

  async onSubmit() {
    try {
      if (this.loader) {return;};
      this.loader = true;
      const body = this.form.value;
      body.validationMethodId = this.id;
      const response = await this.accuracyService.save(body);
      this.accuracy = response.accuracy || {};
      console.log(this.accuracy)
      const Accuracy = {
        guardado: true,
        presociones: true,
        arr: response.accuracy
      }
      this.Guardado.emit(Accuracy)
      this.notificationService.addNotify({type: 'success', title: 'Felicidades' , msg: 'Precision guardada con éxito.'});
    } catch (error) {
      console.warn('Error@accuracy.component@onSubmit', error);
    }
    this.loader = false;
  }

  prepareMask(): void {
    const analysts = this.form.controls.analysts.value;
    const replicas = this.form.controls.replicas.value;
    this.maskA = new Array(analysts || 0);
    this.maskR = new Array(replicas || 0);
  }

  prepareMatrix(): void {
    const analysts = this.form.controls.analysts.value;
    const replicas = this.form.controls.replicas.value;
    if (analysts < 1 || replicas < 1) {
      return;
    }

    const matrixArray = this.form.controls.matrix as FormArray;
    const matrix = _.cloneDeep(matrixArray.value);
    const calc = matrix.length - analysts;
    
    if (calc > 0) {
      this.remove(matrixArray, calc);
    } else if (calc < 0) {
      this.add(matrixArray, calc);
    }

    const calcR = this.maskR.length - replicas;
    if (calcR > 0) {
      this.removeColumns(matrixArray, calcR);
    }
    this.updateColumns(matrixArray, replicas);

    this.prepareMask();
  }

  private remove(list: FormArray, amount: number) {
    for (let i = 0; i < amount; i++) {
      list.removeAt(list.length - 1);
    }
  }

  private add(list: FormArray, amount: number, data?: any[]) {
    for (let i = 0; i < Math.abs(amount); i++) {
      list.push(this.fb.group({
        name: [`Analista ${this.maskA.length + i + 1}`, Validators.compose([Validators.required])]
      }));
    }
  }

  private removeColumns(list: FormArray, amount: number): void {
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < amount; j++) {
        (list.at(i) as FormGroup).removeControl(`${this.maskR.length - j }`); 
      }
    }
  }

  private updateColumns(list: FormArray, amount: number, data?: any[]) {
    for (let i = 0; i < list.length; i++) {
      const analyst = list.at(i) as FormGroup;

      for (let j = 0; j < Math.abs(amount); j++) {
        if (!analyst.controls[j+1]) {
          analyst.addControl(`${j+1}`, this.fb.control(0, Validators.compose([Validators.required])));
        }
      }

      if (data) {
        list.at(i).patchValue({
          ...data[i]
        });
      }
    }
  }

  pasteInfo(event, analyst, replica) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');
    const result = [];
    row_data.forEach(row_data => {
      if (row_data != "") {
        result.push(row_data.split('\t'));
      }
    });
    setTimeout(() => {
      const matrixArray = this.form.controls.matrix as FormArray;
      for (let j = 0; j < result.length; j++) {
        for (let i = 0; i < result[j].length; i++) {
          const record = matrixArray.at(analyst + i) as FormGroup;
          if (!record) {
            continue;
          }
          if (record.controls[`${replica + j}`]) {
            record.controls[`${replica + j}`].patchValue(parseFloat(result[j][i].replace(',', '.')));
          }
        }
      }
    }, 0);
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
      case '9':
        this.helper = '9';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
      break;
      case '10':
      this.helper = '10';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '11':
      this.helper = '11';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '12':
      this.helper = '12';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break
      case '13':
      this.helper = '13';
      //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
      break

    }
  }
}
