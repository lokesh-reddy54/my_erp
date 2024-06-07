import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'mailname' })
export class GetMailNamePipe implements PipeTransform {
  transform(text: string) {
    console.log("GetMailNamePipe :: PipeTransform :: text ::", text)
    if(text && text !=''){
    	text = JSON.parse(text);
    	var names = _.map(text,'name');
    	return names.join(", ");
    }
    return '';
  }
}
