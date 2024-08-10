import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Definition, ItalianVerbsService} from "./verbs";

@Injectable({
  providedIn: 'root'
})
export class VerbsApi {
  constructor(private api: ItalianVerbsService) {

  }
  getWordsFromApi(search: string): Observable<string[]> {
    return this.api.apiItalianVerbsGet(search);
  }

  getWordInfo(word: string): Observable<Definition> {
    return this.api.apiItalianVerbsWordsWordGet(word);
  }
}
