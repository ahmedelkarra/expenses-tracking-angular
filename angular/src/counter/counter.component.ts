import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AddExpenseComponent } from "../add-expense/add-expense.component";
import { GlobalVariableService } from "../app/global-variable.service";


@Component({
    selector: 'app-counter',
    templateUrl: "counter.component.html",
    standalone: true,
    imports: [AddExpenseComponent]
})

export class CounterComponent {
    constructor(private data: GlobalVariableService) { }

    @Input() totalDebit!: number;
    @Input() totalCredit!: number;
    @Input() totalPrice!: number;
    @Input() clientName!: string;

    @Input() isUser: boolean = false
    @Output() isUserChange = new EventEmitter<boolean>()

    ngOnInit(): void {
        this.data.isUserSubject.subscribe((dataInfo) => {
            this.isUserChange.emit(this.isUser = dataInfo)
        })
    }
}