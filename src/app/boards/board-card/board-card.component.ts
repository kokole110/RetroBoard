import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BoardService } from '../board.service';
import { AuthService } from '../../auth/auth.service';

import { Card } from '../card.model'
import { ColorPickService } from '../color-pick.service';
import { Board } from '../board.model';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.css']
})
export class BoardCardComponent implements OnInit {

  @ViewChild('el', {static: true}) cardEl:ElementRef = {} as ElementRef;
  @Input() card: Card = new Card('', '', 0, '')
  @Input() columnId: string = '';
  @Input() columnStyle: string = '';
  @Input() cardIndex: number = 0;
  @Input() allowEdit: boolean = false;
  @Output() deleteCardEvent = new EventEmitter<number>()

  isLiked: boolean = false;
  //likeCount: number = 0;
  id: number = 0;
  userName:string = ''
  board: Board = {
    name: '', 
    description: '',
    date: new Date(),
    columns: [],
    boardId: '',
    cardsNum: 0
  };

  constructor(public colorPickService: ColorPickService,
    private boardService: BoardService,
    private route: ActivatedRoute, 
    private router: Router,
    public authService: AuthService) { }

  ngOnInit(): void {
    console.log(this.card)
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.board = this.boardService.getBoard(this.id);
      }
    )

    if (this.allowEdit) {
      this.cardEl.nativeElement.contentEditable = true;
      this.cardEl.nativeElement.focus();
    }

    this.cardEl.nativeElement.innerText = this.card.text || '';
    this.userName = this.card.createdBy;

    if (this.card.likedBy === this.authService.userId) {
        this.isLiked = true;
    }
    console.log(this.userName)
  }

  onSubmit() {
    if (this.cardEl.nativeElement.innerText.length == 0) {
      this.onCancel(this.cardIndex)
    } else {
      this.board.cardsNum++;
      this.boardService.updateBoard(this.board.boardId, this.board.cardsNum)
      this.cardEl.nativeElement.contentEditable = false;
      this.card.text = this.cardEl.nativeElement.innerText;
      this.boardService.addCardToDbColumn(
        this.columnId, 
        this.card.text, 
        this.authService.userName,
        this.card.likeCount,
        this.card.likedBy)
      this.allowEdit = false;
    }
  }

  onDeleteCard() {
    if (this.card.text) {
      this.board.cardsNum--;
      this.boardService.updateBoard(this.board.boardId, this.board.cardsNum)
      this.boardService.deleteCard(
        this.columnId, 
        this.card.text, 
        this.card.createdBy,
        this.card.likeCount,
        this.card.likedBy);
      console.log(this.card.text)
    }
    this.onCancel(this.cardIndex)
  }

  onCancel(id: number) {
    this.deleteCardEvent.emit(id);
  }

  onLikeCounter() {
    let likeCountPrev: number = this.card.likeCount;
    let likedByPrev: string = this.card.likedBy
    if (!this.isLiked) {
      this.isLiked = true;
      this.card.likeCount++;
      this.card.likedBy = this.authService.userId
    } else {
      this.isLiked = false;
      this.card.likeCount--;
      this.card.likedBy = '';
    }

    this.boardService.saveLikesToDb(
      this.columnId, 
      this.card.text, 
      this.card.createdBy, 
      this.card.likeCount, 
      likeCountPrev,
      this.card.likedBy,
      likedByPrev);
  }

}
