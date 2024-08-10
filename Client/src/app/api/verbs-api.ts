import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {ItalianVerbsService} from "./verbs";

@Injectable({
  providedIn: 'root'
})
export class VerbsApi {
  constructor(private api: ItalianVerbsService) {

  }
  getWordsFromApi(search: string): Observable<string[]> {
    return this.api.apiItalianVerbsGet(search);
  }
}
