import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Book } from '../../shared/book';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Thumbnail } from '../../shared/thumbnail';
import { BookExistsValidatorService } from '../shared/book-exists-validator.service';
import { BookValidators } from '../shared/book-validators';

@Component({
  selector: 'bm-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit, OnChanges {
  bookForm: FormGroup;
  @Output() submitBook = new EventEmitter<Book>();
  @Input() book: Book;
  @Input() editing = false;

  constructor(
    private fb: FormBuilder,
    private bookExistsValidator: BookExistsValidatorService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(): void {
    this.initForm();
    this.setFormValues(this.book);
  }

  private initForm() {
    if (this.bookForm) { return; }

    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      isbn: [
        { value: '', disabled: this.editing },
        [
          Validators.required,
          BookValidators.isbnFormat
        ],
        this.editing ? null : [this.bookExistsValidator]
      ],
      description: [''],
      authors: this.buildAuthorsArray(['']),
      thumbnails: this.buildThumbnailsArray([
        { title: '', url: ''}
      ]),
      published: []
    });
  }

  private setFormValues(book: Book) {
    this.bookForm.patchValue(book);

    this.bookForm.setControl(
      'authors',
      this.buildAuthorsArray(book.authors)
    );

    this.bookForm.setControl(
      'thumbnails',
      this.buildThumbnailsArray(book.thumbnails)
    );
  }

  private buildAuthorsArray(values: string[]): FormArray {
    return this.fb.array(values, BookValidators.atLeastOneAuthor);
  }

  private buildThumbnailsArray(values: Thumbnail[]): FormArray {
    return this.fb.array(values.map(t => this.fb.group(t)));
  }

  get authors(): FormArray {
    return this.bookForm.get('authors') as FormArray;
  }

  get thumbnails(): FormArray {
    return this.bookForm.get('thumbnails') as FormArray;
  }

  addAuthorControl() {
    this.authors.push(this.fb.control(''));
  }

  addThumbnailControl() {
    this.thumbnails.push(this.fb.group({ url: '', title: '' }));
  }

  submitForm() {
    const formValue = this.bookForm.value;

    const authors = formValue.authors.filter(author => author);
    const thumbnails = formValue.thumbnails.filter(thumbnail => thumbnail.url);

    const isbn = this.editing ? this.book.isbn : formValue.isbn;

    const newBook: Book = {
      ...formValue,
      isbn,
      authors,
      thumbnails
    };

    this.submitBook.emit(newBook);
    this.bookForm.reset();
  }

}
