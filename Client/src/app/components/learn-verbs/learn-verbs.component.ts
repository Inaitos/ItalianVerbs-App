import {Component, OnInit, signal} from '@angular/core';
import {Store} from "@ngrx/store";
import {ObserveVerbsData} from "../../state/app.state.selectors";
import {AsyncPipe} from "@angular/common";
import {AppActions} from "../../state/app.state.actions";
import {CardModule} from "primeng/card";
import {Button} from "primeng/button";
import {PanelModule} from "primeng/panel";
import {DomSanitizer} from "@angular/platform-browser";
import {adjustHtmlTranslation} from "../../utils/string-helpers";

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

  constructor(private store: Store, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.store.dispatch(AppActions.initIfEmpty());
    ObserveVerbsData(this.store)
      .subscribe(init => {
        this.verbs = init.verbs;
        this.verbsConj = init.verbsConj;
        this.verbsTranslations = init.verbsTranslations;
        this.index = undefined;
        this.getNextVerb();
      });
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
    const trans = this.verbsTranslations![verb].map(t => adjustHtmlTranslation(this.sanitizer, t));

    this.cj.set(conj);
    this.translations.set(trans);
  }

  get dataReady() {
    return this.verbs != null;
  }
}

