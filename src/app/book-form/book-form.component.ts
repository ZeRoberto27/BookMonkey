import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { BookFactory } from '../shared/book-factory';
import { Book } from '../shared/book';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'bm-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  book = BookFactory.empty();

  @Output() submitBook = new EventEmitter<Book>();
  @ViewChild('bookForm', {static: false}) bookForm: NgForm;

  constructor() { }

  ngOnInit() {
  }

  submitForm() {
    this.submitBook.emit(this.book);

    this.book = BookFactory.empty();
    this.bookForm.reset();
  }

}
