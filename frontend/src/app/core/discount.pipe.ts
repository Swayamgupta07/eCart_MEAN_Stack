import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount',
  standalone: true
})
export class DiscountPipe implements PipeTransform {
  transform(price: number, discountPercentage: number = 10): string {
    const discountedPrice = price - (price * (discountPercentage / 100));
    return `${discountedPrice.toFixed(2)}`;
  }
}
