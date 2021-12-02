import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BoardService } from '../board.service';
import { AuthService } from '../../auth/auth.service';

import { Card } from '../card.model'
import { ColorPickService } from '../color-pick.service';
import { Board } from '../board.model';
import { Column } from '../column.model';
import { Comment } from '../comment.model';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.css']
})
export class BoardCardComponent implements OnInit {

  @ViewChild('el', {static: true}) cardEl:ElementRef = {} as ElementRef;

  @ViewChild('addCommentDiv') set addComment(addComment:ElementRef) {
    if (addComment) {
      this.addCommentDiv = addComment
    }
  }
  @ViewChild('addComment', {static: true}) addCommentDiv:ElementRef = {} as ElementRef;
  @Input() card: Card = new Card('', '', '', 0, [], false, [])
  @Input() column: Column = new Column('',[],'','');
  @Input() cardIndex: number = 0;
  
  
  isLiked: boolean = false;
  id: number = 0; //board id retrieved from url params
  userName:string = '';
  board: Board = new Board('', '', new Date(), [], '', 0);
  isCommentsOpen: boolean = false;

  constructor(public colorPickService: ColorPickService,
    private boardService: BoardService,
    private route: ActivatedRoute, 
    private router: Router,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.board = this.boardService.getBoard(this.id);
      }
    )

    this.userName = this.card.creatorName;

    if (this.card.allowEdit) {
      this.cardEl.nativeElement.contentEditable = true;
      this.cardEl.nativeElement.focus();
    }
    for (let userId of this.card.likedBy) {
      if (userId === this.authService.userId) {
        this.isLiked = true;
      }
    }
    if (this.isCommentsOpen) {
      console.log(this.addCommentDiv.nativeElement)
    }    
  }

  onSubmit() { //create card and add it to DB 'cards' collection
    if (this.cardEl.nativeElement.innerText.length == 0) {
      this.onDeleteCard();
    } else {
      this.card.text = this.cardEl.nativeElement.innerText;
      this.cardEl.nativeElement.innerText = this.card.text;
      this.cardEl.nativeElement.contentEditable = false;
      this.card.allowEdit = false;
      this.boardService.updateCardText(this.card.cardId, this.card.text, this.card.allowEdit);
    }
  }

  onDeleteCard() {
    this.column.cards.splice(this.cardIndex, 1)
    this.board.cardsNum--;
    this.boardService.updateBoard(this.board.boardId, this.board.cardsNum)
    this.boardService.deleteCard(this.card.cardId);
    this.boardService.updateColumnWithDeletingCard(this.column.id, this.card.cardId)
  }

  onLikeCounter() {
    if (!this.isLiked) {
      this.isLiked = true;
      this.card.likeCount++;
      this.card.likedBy.push(this.authService.userId);
      this.boardService.saveLikeToDb(this.card.cardId, this.card.likeCount, this.authService.userId);

    } else {
      this.isLiked = false;
      this.card.likeCount--;
      const likeId = this.card.likedBy.indexOf(this.authService.userId)
      this.card.likedBy.slice(likeId, 1);
      this.boardService.removeLikeFromDb(this.card.cardId, this.card.likeCount, this.authService.userId);
    }
  }

  onCommentsOpen() {
    this.isCommentsOpen = !this.isCommentsOpen;
  }

  onFocus() {
    if (this.addCommentDiv.nativeElement.innerText === 'Add comment here...') {
      this.addCommentDiv.nativeElement.innerText = '';
    }
  }

  onFocusOut() {
    if (!this.addCommentDiv.nativeElement.innerText.length) {
      this.addCommentDiv.nativeElement.innerText = 'Add comment here...';
    } else {
      console.log(this.addCommentDiv.nativeElement.innerText)
    }
  }

  onAddComment() {
    const newComment = new Comment(
      this.authService.userName, 
      this.authService.userId,
      this.addCommentDiv.nativeElement.innerText
    )
    this.card.comments.push(newComment);
    this.boardService.addComment(
      this.card.cardId, 
      this.authService.userName, 
      this.authService.userId, 
      this.addCommentDiv.nativeElement.innerText);
    this.addCommentDiv.nativeElement.innerText = 'Add comment here...'
  }

}
