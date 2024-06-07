import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'toarray' })
export class ToArrayPipe implements PipeTransform {
  transform(text: string) {
    if(text && text !=''){
    	var array = JSON.parse(text);
		return array;
    }
    return [];
  }
}
