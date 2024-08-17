import {Component, Signal, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Button, ButtonDirective} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import {SelectButtonModule} from "primeng/selectbutton";
import {CommonModule} from "@angular/common";
import {AutoCompleteModule} from "primeng/autocomplete";
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {debounceTime, forkJoin, map, Observable, of, switchMap, tap} from "rxjs";
import {VerbsApi} from "./api/verbs-api";
import {DialogModule} from "primeng/dialog";
import {DialogService} from "primeng/dynamicdialog";
import {WordinfodialogComponent} from "./wordinfodialog/wordinfodialog.component";
import {WordInfoDialogInitData} from "./wordinfodialog/wordinfodialogdata";
import {DtoConjugation} from "./api/verbs";
import {Store} from "@ngrx/store";
import {selectBatchSettings, selectTopCount} from "./state/app.state.selectors";
import {AppActions} from "./state/app.state.actions";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, ButtonDirective, Button, MenuModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FormsModule, MenubarModule, SelectButtonModule, AutoCompleteModule, OverlayPanelModule,
    DialogModule,
],
  providers: [DialogService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected searchWord = signal('');
  protected searchWords: Signal<string[] | undefined>;

  protected menuItems: MenuItem[] = [
    {
      label: 'Learn',
      items: [
        {
          label: 'Verbs',
          routerLink: 'learn-verbs'
        }
      ]
    },
    {
      label: "Train",
      items: [
        {
          label: 'Conjugation',
          routerLink: 'train-conjugations'
        }
      ]
    }
  ];
  protected wordsSelectionOptions = [
    { label: 'Top 100', value: 100 },
    { label: 'Top 1000', value: 1000 },
    { label: 'All', value: -1 }
  ];

  protected topCount = signal(100);
  protected batchSize: Observable<number>;

  constructor(
    private api: VerbsApi,
    private dialogService: DialogService,
    private store: Store
  ) {
    this.batchSize = this.store.select(selectBatchSettings).pipe(map(bs => bs.batch))
    const searchWords$= toObservable(this.searchWord)
      .pipe(
        debounceTime(1000),
        tap(s => console.log('init search', s)),
        switchMap(s => !!s ? api.getWordsFromApi(s) : of([])),
        tap(r => console.log('search result', r)),
      );
    this.searchWords = toSignal(searchWords$);
    store.select(selectTopCount).subscribe(v => {
      this.topCount.set(v);
    });
    this.api.getWordsCount().subscribe(num => {
      this.wordsSelectionOptions = [
        { label: 'Top 100', value: 100 },
        { label: 'Top 1000', value: 1000 },
        { label: `All (${num})`, value: 100000 }
      ];
    })
  }

  onSearchTextChanged(searchWordPanel: OverlayPanel, searchInput: HTMLInputElement) {
    if (!searchWordPanel.overlayVisible && !!this.searchWord || searchWordPanel.overlayVisible && !this.searchWord) {
      searchWordPanel.toggle(null, searchInput);
    }
  }

  openWordInfoDialog(w: string) {
    const ref = this.dialogService.open(WordinfodialogComponent, {
      data: <WordInfoDialogInitData>{
        verb: w
      },
      header: w,
    });
    ref.onClose.subscribe();
  }

  setTopCount(topCount: number) {
    this.store.dispatch(AppActions.setTopCount({topCount}));
  }

  reloadWords() {
    this.store.dispatch(AppActions.loadNextBatch());
  }
}
