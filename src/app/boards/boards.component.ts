import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Board } from './board.model'
import { BoardService } from './board.service'

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit, OnDestroy {
  
  boards: Board[] = []
  subscription = new Subscription();
  constructor(private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.subscription = this.boardService.boardsChanged
      .subscribe((boards) => {
        this.boards = boards;
      })
    this.boards = this.boardService.getBoards();
    
    if (this.boardService.boardsIsFetched) {
      return
    } else {
      this.boardService.fetchBoards();
    }
  }

  onNewBoard() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
