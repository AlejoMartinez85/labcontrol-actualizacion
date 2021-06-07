import { Component, OnInit, ViewChild } from '@angular/core';
import { GraficasService } from '../../../services/graficas/graficas.service';
import { NotificationService } from '../../../shared/notification';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.scss']
})
export class GraficasComponent implements OnInit {
  type4: any;
  data4: any;
  type6: any;
  data5: any;
  options5: any;
  options7: any;
  @ViewChild('charventas') charventas: any;
  @ViewChild('chartfacturas') chartfacturas: any;
  user: any;

  constructor(private graficaService: GraficasService,
    private notificationService: NotificationService, ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    /*Pie chart*/
    this.type4 = 'doughnut';
    this.data4 = {
      labels: [
        'Vigentes',
        'Vencidos',

      ],
      datasets: [{
        data: [],
        backgroundColor: [

        ],
        hoverBackgroundColor: [

        ]
      }]
    };
    this.type6 = 'line';
    this.data5 = {
      labels: ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      datasets: []
    };
    this.options5 = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        points: {
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0)'
        }
      }
    };
    this.options7 = {
      responsive: true,
      maintainAspectRatio: true,
      pointDotRadius: 5,



    };
    this.CargarVentas();
    this.CargarFacturas();
  }
  CargarVentas() {
    this.graficaService.getVentas(1).subscribe((value) => {
      this.data5.datasets = value.data;
      this.charventas.chart.update();
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });

  }

  CargarFacturas() {
    this.graficaService.getFacturas(1).subscribe((value) => {
      this.data4.datasets = value.data;
      this.chartfacturas.chart.update();
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });

  }

}
