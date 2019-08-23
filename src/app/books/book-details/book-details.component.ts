import { Component, OnInit } from '@angular/core';
import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book$: Observable<Book>;

  constructor(
    private bs: BookStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const params = this.route.snapshot.paramMap;
    this.book$ = this.bs.getSingle(params.get('isbn'));
  }

  getRating(num: number) {
    return new Array(num);
  }

  removeBook() {
    const params = this.route.snapshot.paramMap;
    if (confirm('Buch wirklich löschen?')) {
      this.bs.remove(params.get('isbn'))
        .subscribe(
          res => this.router.navigate(
            ['../'],
            { relativeTo: this.route }
          )
        );
    }
  }
}
