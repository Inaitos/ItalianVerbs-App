import {Component, OnInit, signal} from '@angular/core';
import {Store} from "@ngrx/store";
import {filter, first, forkJoin, map, switchMap, withLatestFrom} from "rxjs";
import {selectConj, selectVerbs} from "../../state/app.state.selectors";
import {AsyncPipe} from "@angular/common";
import {AppActions} from "../../state/app.state.actions";
import {DtoConjugation} from "../../api/verbs";
import {VerbsApi} from "../../api/verbs-api";
import {CardModule} from "primeng/card";
import {Button} from "primeng/button";

@Component({
  selector: 'app-learn-conjugation',
  standalone: true,
  imports: [
    AsyncPipe,
    CardModule,
    Button
  ],
  templateUrl: './learn-conjugation.component.html',
  styleUrl: './learn-conjugation.component.scss'
})
export class LearnConjugationComponent implements OnInit {
  protected index?: number;
  protected verbs?: string[];
  protected verbsConj?: Record<string, Record<string, string>>;
  protected currentVerb = signal<string|undefined>(undefined)
  protected cj = signal<Record<string, string>|undefined>(undefined);

  constructor(private store: Store, private api: VerbsApi) {
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
            cfg.verbs.map(v => this.api.getWordConjugations(v, cfg.conjGroup).pipe(map(c => ({verb: v, conjugations: c}))))
          )
        ),
        map(r =>
            ({
              verbs: r.map(v => v.verb),
              conj: r.reduce<Record<string, Record<string, string>>>(
                (map, el) => {map[el.verb] = this.toConjugationsDct(el.conjugations); return map; },{})
            })
        )
      ).subscribe(r => {
        this.verbs = r.verbs;
        this.verbsConj = r.conj;
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
    this.cj.set(conj);
  }

  get dataReady() {
    return this.verbs != null;
  }

}

