import {Component, OnInit, SecurityContext, signal} from '@angular/core';
import {Store} from "@ngrx/store";
import {combineLatest, filter, first, forkJoin, map, switchMap, withLatestFrom} from "rxjs";
import {selectConj, selectVerbs} from "../../state/app.state.selectors";
import {AsyncPipe} from "@angular/common";
import {AppActions} from "../../state/app.state.actions";
import {DtoConjugation} from "../../api/verbs";
import {VerbsApi} from "../../api/verbs-api";
import {CardModule} from "primeng/card";
import {Button} from "primeng/button";
import {PanelModule} from "primeng/panel";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-learn-verbs',
  standalone: true,
  imports: [
    AsyncPipe,
    CardModule,
    Button,
    PanelModule
  ],
  templateUrl: './learn-verbs.component.html',
  styleUrl: './learn-verbs.component.scss'
})
export class LearnVerbsComponent implements OnInit {
  protected index?: number;
  protected verbs?: string[];
  protected verbsConj?: Record<string, Record<string, string>>;
  protected verbsTranslations?: Record<string, string[]>;
  protected currentVerb = signal<string|undefined>(undefined)
  protected cj = signal<Record<string, string>|undefined>(undefined);
  protected translations = signal<string[]|undefined>(undefined)

  constructor(private store: Store, private api: VerbsApi, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.store.dispatch(AppActions.initIfEmpty());
    this.store.select(selectVerbs)
      .pipe(
        filter(v => (v?.length ?? 0) > 0),
        map(a => a!),
        withLatestFrom(this.store.select(selectConj)),
        map(a => ({verbs: a[0], conjGroup: a[1].group})),
        switchMap(cfg =>
          forkJoin(
            [
            forkJoin(
              cfg.verbs.map(v => this.api.getWordConjugations(v, cfg.conjGroup).pipe(map(c => ({verb: v, conjugations: c}))))
            ),
            forkJoin(
              cfg.verbs.map(v => this.api.getWordInfo(v).pipe(map(def => ({verb: v, trans: def.definitions?.filter(t => this.filterTranslation(t)) ?? []}))))
            ),
            ]
          ),
        ),
        map(([resultConj, resultTrans]) =>
            ({
              verbs: resultConj.map(v => v.verb),
              conj: resultConj.reduce<Record<string, Record<string, string>>>(
                (map, el) => {map[el.verb] = this.toConjugationsDct(el.conjugations); return map; },{}),
              trans: resultTrans.reduce<Record<string, string[]>>((map, el) => {map[el.verb] = el.trans.map(a => this.removeFirstBrackets(a)); return map;}, {})
            })
        )
      ).subscribe(r => {
        this.verbs = r.verbs;
        this.verbsConj = r.conj;
        this.verbsTranslations = r.trans;
        this.index = undefined;
        this.getNextVerb();
        console.log('Loaded', this.verbs, this.verbsConj);
      });
  }

  toConjugationsDct(conj: DtoConjugation[]): Record<string, string> {
    const ret = conj.reduce<Record<string, string>>( (map, el) => {map[el.form!] = el.shortValue!; return map;}, {});
    return ret;
  }

  getNextVerb() {
    if (this.verbs == null) {
      throw "Verbs may not be undefined";
    }

    if (this.index == null) {
      this.index = 0;
    } else {
      this.index = (this.index + 1) % this.verbs.length;
    }
    const verb = this.verbs[this.index];
    this.currentVerb.set(verb);
    const conj = this.verbsConj![verb];
    const trans = this.verbsTranslations![verb].map(t => this.adjustHtmlTranslation(t));

    this.cj.set(conj);
    this.translations.set(trans);
  }

  get dataReady() {
    return this.verbs != null;
  }

  removeFirstBrackets(s: string): string {
    if (!s) {
      return '';
    }
    let bracket = 0;
    for(let i=0;i<s.length;i++) {
      switch (s[i]) {
        case ' ':
          continue;
        case '(':
          bracket++;
          continue;
        case ')':
          if (bracket == 0) {
            return s;
          }
          bracket--;
          if (bracket > 0) {
            continue;
          }
          i++;
          break;
        default:
          if (bracket > 0) {
            continue;
          }
          break;
      }
      return s.substring(i).trim();
    }
    return s;
  }

  private filterTranslation(t: string): boolean {
    switch (t)  {
      case "Extended meanings":
      case "Figurative meanings":
        return false;
    }
    return true;
  }

  private adjustHtmlTranslation(t: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, t.replace("\n", "<br>")) ?? '';
  }
}

