import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorPickService {

  color: string = '#365a37';

  constructor() { }
}
