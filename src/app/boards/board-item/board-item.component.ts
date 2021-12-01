import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { BoardService } from '../board.service';
import { Board } from '../board.model';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.css']
})
export class BoardItemComponent implements OnInit {
  cardsNum: number = 0
  columsIsFetched = false;
  @Input() board: Board = {
    name: '', 
    description: '',
    date: new Date(),
    columns: [],
    boardId: '',
    cardsNum: 0
  };
  @Input() index: number | null = null;

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
    this.getCardsNum()
  }

  getCardsNum() {
    for (let col of this.board.columns) {
      if (col.cards) {
        this.cardsNum += col.cards.length
      }
    }
    return this.cardsNum;
    // this.boardService.getCardsNumFromDb(this.board.boardId).subscribe(resp => {
    //   console.log(resp)
    // }, error => console.log(error))
  }

  onFetchColumns() {
    if (this.board.columns.length > 0) {
      return;
    }
   this.boardService.fetchColumns(this.board);
  }

}
