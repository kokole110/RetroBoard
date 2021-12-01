import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Column } from '../column.model';
import { Card } from '../card.model';
import { Board } from '../board.model';
import { ColorPickService } from '../color-pick.service';
import { BoardService } from '../board.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.css']
})
export class BoardColumnComponent implements OnInit {

  @Input() column: Column = new Column('',[],'','')
  @Input() index: number = 0;
  cardId: number = 0;
  board: Board = new Board('', '', new Date(), [], '', 0);
  boardId: number = 0;
  
  constructor(public colorPickService: ColorPickService,
    private route: ActivatedRoute, 
    private router: Router,
    private boardService: BoardService,
    private authService: AuthService,
    ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.boardId = +params['id'];
        this.board = this.boardService.getBoard(this.boardId)
      }
    )
  }

  onAddCard() {
    this.boardService.addCardTemplate(
      this.authService.userId, 
      this.column.id,
      this.board.boardId,
      '',
      this.authService.userName,
      0,
      '',
      false,
      this.column.cards
    ).then((respData)=>{
      const newCard: Card = new Card(
        respData.id, 
        '', 
        this.authService.userName, 
        0, 
        [],
        true);
      this.column.cards.push(newCard);
      this.board.cardsNum ++;
      this.boardService.updateBoard(this.board.boardId, this.board.cardsNum)
      this.boardService.updateColumnWithAddingCard(this.column.id, respData.id);
      //this.boardDbId = this.boardService.getBoard(this.boardId).boardId
    })
  }

  onDeleteColumn() {
    this.boardService.getBoard(this.boardId).cardsNum -= this.column.cards.length;
    this.boardService.updateBoard(this.board.boardId, this.board.cardsNum)
    this.boardService.deleteColumn(this.boardId, this.index, this.board.boardId, this.column.id)
  }
}
