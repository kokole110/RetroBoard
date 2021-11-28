import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { Card } from '../card.model'
import { ColorPickService } from '../color-pick.service';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.css']
})
export class BoardCardComponent implements OnInit {

  @ViewChild('el', {static: true}) cardEl:ElementRef = {} as ElementRef;
  @Input() card: Card = new Card('')
  
  constructor(public colorPickService: ColorPickService) { }

  ngOnInit(): void {
    
  }

  onCardTextBlur(){
    this.cardEl.nativeElement.contentEditable = false;
    this.card.text = this.cardEl.nativeElement.innerText;
  }

  onEditText() {
    this.cardEl.nativeElement.contentEditable = true;
    this.cardEl.nativeElement.focus();
  }

}
