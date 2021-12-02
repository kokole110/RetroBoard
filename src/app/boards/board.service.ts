import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { Board } from './board.model';
import { Column } from './column.model';
import { Card } from './card.model';
import { Comment } from './comment.model';

import { 
  Firestore,
  DocumentReference,
  doc,
  setDoc,
  collection, 
  addDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  arrayRemove
   } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private afs: Firestore,
    private router: Router,
    private route: ActivatedRoute) { }

  boardsChanged = new Subject<Board[]>();
  columsIsFetched = false;
  boardsIsFetched = false;
  private boards: Board[] = [];
  // private boards: Board[] = [
  //   new Board(
  //     'Test RetroBoard', 
  //     'Test retroboard description here', 
  //     new Date(),
  //     [
  //       new Column('Went well', [
  //           new Card('', 'First card of first column', '', 0, [], false, [
  //             new Comment('Oksa', '', 'Some comment by Oksa'),
  //             new Comment('Roksa', '', 'Somebody else wrote a comment'),
  //             ]),
  //           new Card('', 'Second card of first column', '', 0, [], false, [])
  //         ],'', '#365a37'),
  //       new Column('Second Went well', [
  //           new Card('', 'First card of second column', '', 0, [], false, []),
  //           new Card('', 'Second card of second column', '', 0, [], false, [])
  //         ],'', '#843043'),
  //     ],
  //     '',
  //     4
  //   ),
  //   new Board(
  //     'Second Test RetroBoard', 
  //     'Second Test retroboard description here', 
  //     new Date(),
  //     [
  //       new Column('Second Went well', [],'','#843043')
  //     ],
  //     '',
  //     0
  //   ),
  //   new Board(
  //     'Third Test RetroBoard', 
  //     'Third Test retroboard description here', 
  //     new Date(),
  //     [
  //       new Column('Third Went well', [],'','#843043'),
  //     ],
  //     '',
  //     0
  //   ),
  // ];

  getBoards() {
    return this.boards.slice();
  }
  getBoard(id: number) {
    return this.boards[id]
  }

  addBoard(newBoard: Board) {
    this.boards.push(newBoard);
    this.boardsChanged.next(this.boards.slice());
  }

  updateBoard(id: string, cardsNum: number) {
    const boardRef = doc(this.afs, "boards", id);
    updateDoc(boardRef, {
      cardsNum: cardsNum,
    })
  }

  deleteBoard(id: number, boardId: string) {
    this.boards.splice(id, 1);
    this.boardsChanged.next(this.boards.slice());
    this.router.navigate(['/boards']);

    deleteDoc(doc(this.afs, "boards", boardId)) //delete board from boards collection
    const columnsOfBoard = query(collection(this.afs, "columns"), where("boardId", "==", boardId))
    getDocs(columnsOfBoard).then(querySnapshot => {
      querySnapshot.forEach(docEl => {
        deleteDoc(docEl.ref)
      })
    });
    const cardsOfBoard = query(collection(this.afs, "cards"), where("boardId", "==", boardId))
    getDocs(cardsOfBoard).then(cardsSnapshot => {
      cardsSnapshot.forEach(card => {
        deleteDoc(card.ref)
      })
    });
  }

  addColumn(boardDbId: string, columnName: string, boardId: number, bgColor: string) {
    addDoc(collection(this.afs, "columns"), {
      boardId: boardDbId, 
      colName: columnName,
      style: bgColor
    }).then((respData)=>{
      const newColumn: Column = new Column(columnName, [], respData.id, bgColor);
        this.getBoard(boardId).columns.push(newColumn);
    })
  }

  deleteColumn(boardId: number, colId: number, boardDbId: string, colDbId: string) {
    this.getBoard(boardId).columns.splice(colId, 1);

    deleteDoc(doc(this.afs, "columns", colDbId));
    const cardsOfColumn = query(collection(this.afs, "cards"), where("columnId", "==", colDbId))
    getDocs(cardsOfColumn).then(cardsSnapshot => {
      cardsSnapshot.forEach(card => {
        deleteDoc(card.ref)
      })
    });
  }

  updateColumnWithAddingCard(columnId: string, cardId: string) {
    const columnRef = doc(this.afs, "columns", columnId);
    updateDoc(columnRef, {
      cards: arrayUnion(cardId)
    })
  }

  updateColumnWithDeletingCard(columnId: string, cardId: string) {
    const columnRef = doc(this.afs, "columns", columnId);
    updateDoc(columnRef, {
      cards: arrayRemove(cardId)
    })
  }
  
  addCardTemplate(
    userId: string,
    columnId: string, 
    boardId: string,
    text: string, 
    userName: string,
    likeCount: number, 
    likedBy: string,
    allowEdit: boolean,
    comments: Comment[]): Promise<DocumentReference> {
    return addDoc(collection(this.afs, "cards"), {
      createdBy: userId, 
      creatorName: userName,
      columnId: columnId,
      boardId: boardId,
      text: text,
      likeCount: likeCount,
      likedBy: likedBy,
      allowEdit: allowEdit,
      comments: comments
    })
    // .then((respData)=>{
    //   const newCard: Card = new Card(respData.id, text, userName, likeCount, likedBy);
    //   columnCards.push(newCard);
    //   this.updateColumn(columnId, respData.id)
    //   console.log(newCard);
    //   console.log(columnCards);
    // })
  }

  updateCardText(
    cardId: string, 
    text: string, 
    allowEdit: boolean
    ) {
    const cardRef = doc(this.afs, "cards", cardId);
    updateDoc(cardRef, {
      text: text,
      allowEdit: allowEdit
    })
  }

  deleteCard(cardId: string) {
    deleteDoc(doc(this.afs, "cards", cardId))
  }

  fetchBoards() {
    const dbBoards = query(collection(this.afs, "boards"));
    getDocs(dbBoards).then(querySnapshot => {
      querySnapshot.forEach(board => {
        const boardId = board.ref.id
        let newBoard = new Board(
          board.data().name,
          board.data().description,
          (board.data().createdDate.toDate()).toDateString(),              
          [],
          boardId,
          board.data().cardsNum
          )
        this.boards.push(newBoard)
      })
      console.log(this.boards);
    });
    this.boardsChanged.next(this.boards);
    this.boardsIsFetched = true;
  }

  fetchColumns(board: Board) {
    const dbColumns = query(collection(this.afs, "columns"), where("boardId", "==", board.boardId));
    getDocs(dbColumns).then(columnsSnapshot => {
      columnsSnapshot.forEach(column => {
        console.log(column.ref)
        let newColumn = new Column(
          column.data().colName, 
          [], 
          column.ref.id,
          column.data().style
        )
        const cards = column.data().cards
        for (let cardId of cards) {
          const cardRef = doc(this.afs, "cards", cardId);
          getDoc(cardRef).then(card => {
            if (card.exists()) {
              newColumn.cards.push(new Card(
              card.ref.id, 
              card.data().text,
              card.data().creatorName,
              card.data().likeCount,
              card.data().likedBy,
              card.data().allowEdit,
              card.data().comments
              ))
            }    
          })
        }
        board.columns.push(newColumn)
      })
      console.log(board.columns);
    })
  }

  saveLikeToDb(
    cardId: string, 
    likeCount: number, 
    userId: string) 
  {
    const cardRef = doc(this.afs, "cards", cardId);
    updateDoc(cardRef, {
      likeCount: likeCount,
      likedBy: arrayUnion(userId), 
    })
  }

  removeLikeFromDb(
    cardId: string, 
    likeCount: number, 
    userId: string) 
  {
    const cardRef = doc(this.afs, "cards", cardId);
    updateDoc(cardRef, {
      likeCount: likeCount,
      likedBy: arrayRemove(userId), 
    })
  }

  addComment(cardId: string, userName: string, userId: string, comment: string) {
    const cardRef = doc(this.afs, "cards", cardId);
    updateDoc(cardRef, {
      comments: arrayUnion({
        creatorName: userName,
        creatorId: userId,
        text: comment
      }), 
    })
  }

  // getUserNameFromDb(columnId: string, text: string) {
  //   const columnRef = doc(this.afs, "columns", columnId);
  //   getDoc(columnRef).then(columnData => {
  //     if (columnData.exists()) {
  //       console.log("Document data:", columnData.data());
  //       for (let card of columnData.data().cards) {
  //         if (card.text === text) {
  //           return card.createdBy;
  //           break;
  //         }
  //       }
  //     } else {
  //       console.log("No such document!");
  //     }
  //   })   
  // }
}
