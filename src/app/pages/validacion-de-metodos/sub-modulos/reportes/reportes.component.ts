import { Component, Input, OnInit } from '@angular/core';
import { element } from 'protractor';
import { linearRegression, linearRegressionLine, rSquared } from 'simple-statistics';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  @Input() Json: any;
  ArregloGeneral: any;
  mLinearity = 0; bLinearity = 0; R2Linearity = 0;
  array1Linearity= [];
  array2Linearity= [];
  //Bias

  // Accuracy
  Pvalue = 0;
  standardDeviationBetweenGroups = 0;
  // Robustness
  arrayX_x = [];
  arrayRobustez= ['A-a','B-b','C-c','D-d','E-e','F-f','G-g',];
  robustezCritica = 0;
  arrSensible = [];
  sensible = false;
  constructor() { }

  ngOnInit() {
    this.ArregloGeneral = this.Json;
    console.log(this.ArregloGeneral);
    // this.linearity();
    this.R2Linearity = parseFloat(this.ArregloGeneral.linealidad.arr.Rquadrado);
    this.Pvalue = parseFloat(this.ArregloGeneral.presicion.arr.anova.treatment.PV);
    console.log(this.Pvalue)
    //Accuracy
    this.Pvalue = parseFloat(this.ArregloGeneral.presicion.arr.anova.treatment.PV);
    this.standardDeviationBetweenGroups = parseFloat(this.ArregloGeneral.presicion.arr.standardDeviationBetweenGroups);
    console.log(this.Pvalue)
    // Robustness
    this.robustezCritica = parseFloat(this.ArregloGeneral.robustez.arr.robustezCritica);
    this.robustness();
    
  }

  linearity(){
    this.array1Linearity = this.ArregloGeneral.linealidad.arr.concentraciones;
    this.array2Linearity = this.ArregloGeneral.linealidad.arr.areras;
    var linearityArr = Array();
    this.array1Linearity.forEach((element, index)=>{
      linearityArr.push([this.array1Linearity[index],this.array2Linearity[index]])
    })
    linearRegression(linearityArr);
    this.mLinearity = linearRegression(linearityArr)['m'];
    this.bLinearity = linearRegression(linearityArr)['b'];

    var regressionLine = linearRegressionLine(linearRegression(linearityArr));
    // this.R2Linearity = rSquared(linearityArr, regressionLine); // = 1 this line is a perfect fit

    // console.log('Array arreglado')
    // console.log(linearityArr)
    // console.log('resultados')
    // console.log(this.mLinearity)
    // console.log(this.bLinearity)
    // console.log(this.R2Linearity)
  }

  robustness(){
    this.arrSensible = [];
    this.arrayX_x = [];
    this.ArregloGeneral.robustez.arr['X_x'].forEach(element => {
      
      this.arrayX_x.push(parseFloat(element));
    });
    console.log(this.robustezCritica);
    
    this.arrayX_x.forEach(element =>{
      
      if(element > this.robustezCritica ){
        console.log('sensible');
        
        this.arrSensible.push('Sensible')
        this.sensible = true;
      }else if(element <= this.robustezCritica){
        console.log(element);
        this.arrSensible.push('No Sensible')}
      console.log('no sensible')  
    });


    console.log(this.arrayX_x);
    console.log(this.arrSensible);
    
  }

  bias(){

  }

  showArreglo(){
    this.ArregloGeneral = this.Json;
    console.log(this.ArregloGeneral);
    // console.log(this.R2Linearity)
    // this.robustness();
    // console.log(this.Pvalue)
    // this.linearity();
    // console.log(this.array1Linearity)
    // console.log(this.array2Linearity)
  }

}
