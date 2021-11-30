import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { Board } from './board.model';
import { Column } from './column.model';
import { Card } from './card.model';

import { 
  Firestore,
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
  //private boards: Board[] = [];
  private boards: Board[] = [
    new Board(
      'Test RetroBoard', 
      'Test retroboard description here', 
      new Date(),
      [
        new Column('Went well', [
            new Card('First card of first column', ''),
            new Card('Second card of first column', '')
          ],'', '#365a37'),
        new Column('Second Went well', [
            new Card('First card of second column', ''),
            new Card('Second card of second column', '')
          ],'', '#843043'),
      ],
      ''
    ),
    new Board(
      'Second Test RetroBoard', 
      'Second Test retroboard description here', 
      new Date(),
      [
        new Column('Second Went well', [],'','#843043')
      ],
      ''
    ),
    new Board(
      'Third Test RetroBoard', 
      'Third Test retroboard description here', 
      new Date(),
      [
        new Column('Third Went well', [],'','#843043'),
      ],
      ''
    ),
  ];

  getBoards() {
    return this.boards.slice();
  }
  getBoard(id: number) {
    return this.boards[id]
  }

  // getCardsNumFromDb(boardId: string): Observable<number> {
  //   const columnsOfBoard = query(collection(this.afs, "columns"), where("boardId", "==", boardId))
  //   getDocs(columnsOfBoard).then(querySnapshot => {
  //     querySnapshot.forEach(column => {
  //       console.log(column.data().cards.length)
  //       this.num += column.data().cards.length;
  //     })
  //   });
  //   return this.num; 
  // }

  addBoard(newBoard: Board) {
    this.boards.push(newBoard);
    this.boardsChanged.next(this.boards.slice());
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
    deleteDoc(doc(this.afs, "columns", colDbId))
  }

  addCardToDbColumn(columnId: string, text: string, userName: string) {
    const columnRef = doc(this.afs, "columns", columnId);
    updateDoc(columnRef, {
      cards: arrayUnion({text: text, createdBy: userName}),
    })
  }  

  deleteCard(columnId: string, text: string) {
    const columnRef = doc(this.afs, "columns", columnId);
    updateDoc(columnRef, {
      cards: arrayRemove(text)
    });
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
          boardId
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
        let newColumn = new Column(
          column.data().colName, 
          column.data().cards || [], 
          board.boardId,
          column.data().style
        )
        board.columns.push(newColumn)
      })
      console.log(board.columns);
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
