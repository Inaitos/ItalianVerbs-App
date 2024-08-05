import { Component } from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonDirective, Button, MenuModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FormsModule, MenubarModule, SelectButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Client';
  protected searchWord?: string;
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
  protected wordsSelection = [
    { label: 'Top 100', value: '100' },
    { label: 'Top 1000', value: '1000' },
    { label: 'All available', value: 'all' }
  ];
}
