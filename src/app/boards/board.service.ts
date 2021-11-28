import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Board } from './board.model';
import { Column } from './column.model';
import { Card } from './card.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private router: Router, private route: ActivatedRoute) { }

  //private boards: Board[] = [];
  private boards: Board[] = [
    new Board(
      'Test RetroBoard', 
      'Test retroboard description here', 
      new Date(),
      [
        new Column('Went well', [
            new Card('First card of first column', '#365a37'),
            new Card('Second card of first column', '#365a37')
          ]),
        new Column('Second Went well', [
            new Card('First card of second column', '#843043'),
            new Card('Second card of second column', '#843043')
          ]),
      ]
    ),
    new Board(
      'Second Test RetroBoard', 
      'Second Test retroboard description here', 
      new Date(),
      [
        new Column('Second Went well', [])
      ]
    ),
    new Board(
      'Third Test RetroBoard', 
      'Third Test retroboard description here', 
      new Date(),
      [
        new Column('Third Went well', []),
      ]
    ),
  ];

  getBoards() {
    return this.boards.slice();
  }

  getBoard(id: number) {
    return this.boards[id]
  }

  addBoard(newBoard: Board) {
    this.boards.push(newBoard);
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
