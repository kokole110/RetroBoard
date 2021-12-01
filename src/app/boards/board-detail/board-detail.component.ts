import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { 
  Firestore,
  doc,
  setDoc,
  collection, 
  addDoc,
  updateDoc,
  arrayUnion,
  deleteDoc
   } from "@angular/fire/firestore"; 

import { Board } from '../board.model';
import { Column } from '../column.model';
import { BoardService } from '../board.service';
import { ColorPickService } from '../color-pick.service';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css']
})
export class BoardDetailComponent implements OnInit {
  board: Board = {
    name: '', 
    description: '',
    date: new Date(),
    columns: [],
    boardId: '',
    cardsNum: 0
  };
  
  id: number = 0;
  addColumnMode: boolean = false;
  bgColor: string = '';

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute, 
    private router: Router,
    public colorPickService: ColorPickService,
    private afs: Firestore,
    ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.board = this.boardService.getBoard(this.id);
      }
    )
  }

  onDeleteBoard() {
    if (confirm('Are you sure to delete ' + this.board.name + ' board?')) {
      this.boardService.deleteBoard(this.id, this.board.boardId)
    }
  }

  onAddColumn() {
    this.addColumnMode = true;
  }

  onSubmit(form: NgForm) {
    this.bgColor = this.colorPickService.color;
    const columnName = form.value.colName;
    const boardDbId = this.board.boardId;
    const boardId = this.id;
    this.boardService.addColumn(boardDbId, columnName, boardId, this.bgColor);
    this.addColumnMode = false;
  }

  onCancel() {
    this.addColumnMode = false;
  };

}
