import { Component, OnInit, Input } from '@angular/core';

import { Comment } from '../comment.model'
import { Card } from '../card.model'
@Component({
  selector: 'app-board-comment',
  templateUrl: './board-comment.component.html',
  styleUrls: ['./board-comment.component.css']
})
export class BoardCommentComponent implements OnInit {

  @Input() comment: Comment = new Comment('', '', '')
  @Input() card: Card = new Card('', '', '', 0, [], false, []);
  @Input() commentIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
