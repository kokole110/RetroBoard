import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Board } from './board.model'
import { BoardService } from './board.service'

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {
  
  boards: Board[] = []

  constructor(private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.boards = this.boardService.getBoards();
  }

  onNewBoard() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

}
