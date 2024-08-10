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
import {debounceTime, switchMap, tap} from "rxjs";
import {VerbsApi} from "./api/verbs-api";
import {DialogModule} from "primeng/dialog";
import {DialogService} from "primeng/dynamicdialog";
import {WordinfodialogComponent} from "./wordinfodialog/wordinfodialog.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, ButtonDirective, Button, MenuModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FormsModule, MenubarModule, SelectButtonModule, AutoCompleteModule, OverlayPanelModule,
    DialogModule
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
      label: "Conjugation",
      items: [
        {
          label: 'Next'
        }
      ]
    }
  ];
  protected wordsSelectionOptions = [
    { label: 'Top 100', value: '100' },
    { label: 'Top 1000', value: '1000' },
    { label: 'All (12436)', value: 'all' }
  ];

  protected wordsSelection: string = '100';

  constructor(
    private api: VerbsApi,
    private dialogService: DialogService
  ) {
    const searchWords$= toObservable(this.searchWord)
      .pipe(
        debounceTime(1000),
        tap(s => console.log('init search', s)),
        switchMap(s => api.getWordsFromApi(s)),
        tap(r => console.log('search result', r)),
      );
    this.searchWords = toSignal(searchWords$);
  }

  onSearchTextChanged(searchWordPanel: OverlayPanel, searchInput: HTMLInputElement) {
    if (!searchWordPanel.overlayVisible && !!this.searchWord || searchWordPanel.overlayVisible && !this.searchWord) {
      searchWordPanel.toggle(null, searchInput);
    }
  }

  openWordInfoDialog(w: string) {
    this.api.getWordInfo(w)
      .pipe(
        switchMap(
        wordDef => {
          const ref = this.dialogService.open(WordinfodialogComponent,{
            data: {
              WordDefinition: wordDef
            }
          });
          return ref.onClose;
        })
      )
      .subscribe(_ => {});
  }
}
