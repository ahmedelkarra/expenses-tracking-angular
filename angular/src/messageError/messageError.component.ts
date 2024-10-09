import { Component, Input } from "@angular/core";



@Component({
    selector: 'app-messageError',
    templateUrl: 'messageError.component.html',
    standalone: true,
})

export class MessageErrorComponent {
    @Input() messageError!: string
}