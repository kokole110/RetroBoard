import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Column } from '../column.model';
import { Card } from '../card.model';
import { ColorPickService } from '../color-pick.service';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.css']
})
export class BoardColumnComponent implements OnInit {

  @Input() column: Column = new Column('',[])
  @Input() index: number = 0;
  bgColor: string = this.colorPickService.color;

  @Output() deleteColEvent = new EventEmitter<number>()
  
  constructor(public colorPickService: ColorPickService,
    private boardService: BoardService) { }

  ngOnInit(): void {
  }

  onAddCard() {
    const newCard: Card = new Card('', this.bgColor);
    this.column.cards.push(newCard);
  }

  onDeleteColumn(id: number) {
    this.deleteColEvent.emit(id)
  }

}
