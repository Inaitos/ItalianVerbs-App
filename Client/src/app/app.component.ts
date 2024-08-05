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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonDirective, Button, MenuModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FormsModule, MenubarModule],
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
          label: 'Top 100',
        }
      ]
    }
  ];
}
