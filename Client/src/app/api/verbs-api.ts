import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Word} from "../model/word";

@Injectable({
  providedIn: 'root'
})
export class VerbsApi {
  getWords(search: string): Observable<Word[]> {
      return of([...Array(search?.length ?? 1).keys()].map(n=> ({word: `${search}${n}`, url: `http://www.google.de?q=${search}${n}`})));
  }
}
