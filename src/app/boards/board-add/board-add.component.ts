import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Board } from '../board.model'
import { BoardService } from '../board.service'

@Component({
  selector: 'app-board-add',
  templateUrl: './board-add.component.html',
  styleUrls: ['./board-add.component.css']
})
export class BoardAddComponent implements OnInit {

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const newBoard = new Board(
      form.value.name,
      form.value.description,
      new Date(),
      []
    )
    this.boardService.addBoard(newBoard);
  }

  onCancel() {
    this.boardService.onCancel();
  }
}
