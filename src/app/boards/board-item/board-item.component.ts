import { Component, OnInit, Input } from '@angular/core';
import { Board } from '../board.model';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.css']
})
export class BoardItemComponent implements OnInit {

  @Input() board: Board = {
    name: '', 
    description: '',
    date: new Date(),
    columns: [],
  };
  @Input() index: number | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
