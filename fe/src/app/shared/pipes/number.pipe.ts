import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'num' })
export class NumberPipe implements PipeTransform {
    transform(value: number, args: string[]): any {
        if (value) {
            if (!isNaN(value)) {
                value = parseInt(value+"");
                value = parseFloat(value.toFixed(2));
                var result = value.toString().split('.');

                var lastThree = result[0].substring(result[0].length - 3);
                var otherNumbers = result[0].substring(0, result[0].length - 3);
                if (otherNumbers != '')
                    lastThree = ',' + lastThree;
                var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

                if (result.length > 1) {
                    output += "." + result[1];
                }

                return  output;
            } else {
                return value;
            }
        } else {
            return "0";
        }

    }
}