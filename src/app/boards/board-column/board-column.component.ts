import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Column } from '../column.model';
import { Card } from '../card.model';
import { ColorPickService } from '../color-pick.service';
import { BoardService } from '../board.service';
import { AuthService } from '../../auth/auth.service';
//import { Board } from '../board.model';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.css']
})
export class BoardColumnComponent implements OnInit {

  @Input() column: Column = new Column('',[],'','')
  @Input() index: number = 0;
  //bgColor: string = '';
  cardId: number = 0;
  boardId: number = 0
  isEditableCard: boolean = false
  //@Output() deleteColEvent = new EventEmitter<number>()
  
  constructor(public colorPickService: ColorPickService,
    private route: ActivatedRoute, 
    private router: Router,
    private boardService: BoardService,
    private authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.boardId = +params['id'];
      }
    )
    //this.bgColor = this.column.style
  }

  onAddCard() {
    this.isEditableCard = true;
    console.log(this.authService.userName)
    const newCard: Card = new Card('', this.authService.userName);
    this.column.cards.push(newCard);
    console.log(newCard)
  }

  onDeleteColumn() {
    //this.deleteColEvent.emit(id)
    const boardDbId = this.boardService.getBoard(this.boardId).boardId
    this.boardService.deleteColumn(this.boardId, this.index, boardDbId, this.column.id)
  }

  deleteCard(id: number) {
    this.column.cards.splice(id, 1)
  }

}
