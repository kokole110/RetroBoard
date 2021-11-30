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
    boardId: ''
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
    this.boardService.deleteBoard(this.id, this.board.boardId)
  }

  onAddColumn() {

    this.addColumnMode = true;
  }

  // deleteColumn(id: number) {
  //   this.board.columns.splice(id, 1);
  //   deleteDoc(doc(this.afs, "columns", "DC"))
  // }

  onSubmit(form: NgForm) {
    this.bgColor = this.colorPickService.color;
    const columnName = form.value.colName;
    const boardDbId = this.board.boardId;
    const boardId = this.id;
    this.boardService.addColumn(boardDbId, columnName, boardId, this.bgColor);
    this.addColumnMode = false;

    // addDoc(collection(this.afs, "columns"), {
    //   boardId: this.board.boardId, 
    //   colName: columnName,
    // }).then((respData)=>{
    //   const newColumn: Column = new Column(columnName, [], respData.id);
    //     this.board.columns.push(newColumn);
    //     this.addColumnMode = false;
    // })

    //this.boardService.addColumnToBoard(this.board.boardId, columnName);
    // const boardRef = doc(this.afs, "boards", this.board.boardId);
    // updateDoc(boardRef, {
    //   columns: arrayUnion({colName: form.value.colName})
    // })
  }

  onCancel() {
    this.addColumnMode = false;
  };

}
