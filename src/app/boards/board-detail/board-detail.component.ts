import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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
  };
  
  id: number = 0;
  addColumnMode: boolean = false;

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute, 
    private router: Router,
    public colorPickService: ColorPickService) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.board = this.boardService.getBoard(this.id);
      }
    )
  }

  onAddColumn() {
    this.addColumnMode = true;
  }

  deleteColumn(id: number) {
    this.board.columns.splice(id, 1)
  }

  onSubmit(form: NgForm) {
    const columnName = form.value.colName;
    const newColumn: Column = new Column(columnName, []);
    this.board.columns.push(newColumn);
    this.addColumnMode = false;
    
  }

  onCancel() {
    this.addColumnMode = false;
  };

}
