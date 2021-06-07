import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _  from 'lodash';

/* Models */
import { WorkInterval } from '../../../../models/WorkInterval';

/* Services */
import { WorkIntervalService } from '../../../../services/work-interval/work-interval.service';
import { NotificationService } from '../../../../shared/notification/notification.service';

@Component({
  selector: 'app-work-interval',
  templateUrl: './work-interval.component.html',
  styleUrls: ['./work-interval.component.scss', '../../../../../assets/icon/icofont/css/icofont.scss']
})
export class WorkIntervalComponent implements OnInit {
  
  @Input() id: string;
  @Input() permisosLocal: any;
  @Output() Guardado: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  workInterval: WorkInterval = {};
  showEdit = false;

  loader = false;

  constructor(
    private fb: FormBuilder,
    private workIntervalService: WorkIntervalService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.getWorkIntervalFromAPi();
    this.build();
    this.renderChart();
  }

  private async getWorkIntervalFromAPi(): Promise<void> {
    try {
      if (this.loader) {return;};
      this.loader = true;
      const response = await this.workIntervalService.getByValidationMethod(this.id);
      this.workInterval = response.workInterval || {};
      if (this.permisosLocal.editar) {
        this.showEdit = !(this.workInterval._id != undefined);
      }
      const WorkInterval = {
        guardado: false,
        intervalos: true,
        arr: response.workInterval
      }
      this.Guardado.emit(WorkInterval)
    } catch (error) {
      console.warn('Error@workInterval.component@getWorkIntervalFromAPi', error);
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
      unidad: [this.workInterval.unidad || ''],
      labelx: [this.workInterval.labelx || 'Eje X', Validators.compose([Validators.required])],
      labely: [this.workInterval.labely || 'Eje Y', Validators.compose([Validators.required])],
      lowerLimit: [this.workInterval.lowerLimit || null, Validators.compose([Validators.required])],
      upperLimit: [this.workInterval.upperLimit || null, Validators.compose([Validators.required])],
      grade: [this.workInterval.grade || 0, Validators.compose([Validators.required])],
      intercept: [this.workInterval.intercept || 0, Validators.compose([Validators.required])]
    });
  }

  async onSubmit() {
    try {
      if (this.loader) {return;};
      this.loader = true;
      const body = this.form.value;
      body.validationMethodId = this.id;
      const response = await this.workIntervalService.save(body);
      this.workInterval = response.workInterval || {};
      this.notificationService.addNotify({type: 'success', title: 'Felicidades' , msg: 'Intervalo de trabajo guardado con éxito.'});
      const WorkInterval = {
        guardado: true,
        intervalos: true,
        arr: response.workInterval
      }
      this.Guardado.emit(WorkInterval)
    } catch (error) {
      console.warn('Error@workInterval.component@onSubmit', error);
    }
    this.renderChart();
    this.loader = false;
  }

  private renderChart() {
    if (this.workInterval._id == undefined) {
      return;
    }
    document.getElementById('workIntervalChart').innerHTML = '';
    let chart: ApexCharts;
    let options = {};

    const lowerLimit = this.form.controls.lowerLimit.value;
    const upperLimit = this.form.controls.upperLimit.value;
    const grade = this.form.controls.grade.value;
    const intercept = this.form.controls.intercept.value;
    const initY = lowerLimit*grade + intercept;
    const finalY = upperLimit*grade + intercept;
    const matrix = [
      [lowerLimit, initY],
      [upperLimit, finalY]
    ];

    // const initLimit = [[lowerLimit, 0], [lowerLimit, finalY*1.1]];
    // const finalLimit = [[upperLimit, 0], [upperLimit, finalY*1.1]];

    options = {
      series: [{
        name: 'Resultado',
        type: 'line',
        data: matrix
      }],
      chart: {
        stacked: false,
        height: 350,
        type: 'line',
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },
      fill: {
        type: 'solid',
      },
      /* xaxis: {
        labels: {
          minWidth: 0,
          maxWidth: upperLimit
        }
      },
      yaxis: {
        labels: {
          minWidth: 0,
          maxWidth: upperLimit
        }
      }, */
      annotations: {
        yaxis: [],
        xaxis: [{
          x: lowerLimit,
          strokeDashArray: 0,
          borderColor: '#775DD0',
          label: {
            borderColor: '#775DD0',
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: 'Límite laterial A',
          }
        }, {
          x: upperLimit,
          fillColor: '#B3F7CA',
          opacity: 0.4,
          label: {
            borderColor: '#B3F7CA',
            style: {
              fontSize: '10px',
              color: '#fff',
              background: '#00E396',
            },
            offsetY: -10,
            text: 'Límite laterial B',
          }
        }],
        points: [{
          x: matrix[0][0],
          y: matrix[0][1],
          marker: {
            size: 8,
            fillColor: '#fff',
            strokeColor: 'red',
            radius: 2,
            cssClass: 'apexcharts-custom-class'
          },
          label: {
            borderColor: '#FF4560',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#FF4560',
            },
            text: `X: ${matrix[0][0]} , Y: ${matrix[0][1]}`,
          }
        },{
          x: matrix[1][0],
          y: matrix[1][1],
          marker: {
            size: 8,
            fillColor: '#fff',
            strokeColor: 'red',
            radius: 2,
            cssClass: 'apexcharts-custom-class'
          },
          label: {
            borderColor: '#FF4560',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#FF4560',
            },
            text: `X: ${matrix[1][0]} , Y: ${matrix[1][1]}`,
          }
        }]
      },
      stroke: {
        curve: 'straight'
      },
      grid: {
        padding: {
          right: 32,
          left: 32,
          top: 32,
          bottom: 32
        }
      }
    };
    chart = new ApexCharts(document.querySelector('#workIntervalChart'), options);
    chart.render();
  }
}