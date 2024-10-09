import { Component, Input } from "@angular/core";



@Component({
    selector: 'app-messageSuccessful',
    templateUrl: 'messageSuccessful.component.html',
    standalone: true,
})

export class MessageSuccessfulComponent {
    @Input() messageSuccessful!: string
}