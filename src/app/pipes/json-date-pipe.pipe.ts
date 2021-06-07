import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'jsonDatePipe'
})
export class JsonDatePipePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: string, format: string = 'dd/MM/yyyy') {
    const date = new Date(value);
    const dateNewFrag = this.datePipe.transform(date, format).split('/');
    return `${dateNewFrag[1]}/${dateNewFrag[0]}/${dateNewFrag[2]}`;
  }

}
