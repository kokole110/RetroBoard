import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Firestore, doc, setDoc, collection, addDoc } from "@angular/fire/firestore"; 

import { Board } from '../board.model'
import { BoardService } from '../board.service'

@Component({
  selector: 'app-board-add',
  templateUrl: './board-add.component.html',
  styleUrls: ['./board-add.component.css']
})
export class BoardAddComponent implements OnInit {

  constructor(private boardService: BoardService, 
    private router: Router, 
    private route: ActivatedRoute,
    private afs: Firestore) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    // const newBoard = new Board(
    //   form.value.name,
    //   form.value.description,
    //   new Date(),
    //   []
    // )
    addDoc(collection(this.afs, "boards"), {
      name: form.value.name,
      description: form.value.description,
      createdDate: new Date(),
      columns: []
    }).then(respData => {
      console.log(respData.id)
      const newBoard = new Board(
        form.value.name,
        form.value.description,
        new Date(),
        [],
        respData.id
      )

      this.boardService.addBoard(newBoard);
      this.onCancel();
    });
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
