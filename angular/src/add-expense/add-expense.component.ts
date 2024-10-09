import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GlobalVariableService } from "../app/global-variable.service";
import { Apollo, gql } from "apollo-angular";
import { MessageErrorComponent } from "../messageError/messageError.component";
import { MessageSuccessfulComponent } from "../messageSuccessful/messageSuccessful.component";


@Component({
    selector: 'app-add-expense',
    templateUrl: 'add-expense.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, MessageErrorComponent, MessageSuccessfulComponent]
})

export class AddExpenseComponent implements OnInit {
    constructor(private data: GlobalVariableService, private apollo: Apollo) { }

    @Input() showModal: boolean = false
    @Output() showModalChange = new EventEmitter<boolean>()

    @Input() task_id!: string
    @Input() title!: string
    @Input() amount!: number
    @Input() expense!: string

    @Input() messageError: string = ''
    @Output() messageErrorChange = new EventEmitter<string>()

    @Input() messageSuccessful: string = ''
    @Output() messageSuccessfulChange = new EventEmitter<string>()


    addForm = new FormGroup({
        title: new FormControl<string>('', [Validators.required, Validators.maxLength(30)]),
        amount: new FormControl<number>(0, [Validators.required]),
        expense: new FormControl<string>('', [Validators.required]),
    });

    ngOnInit(): void {
        this.addForm.patchValue({
            title: this.title,
            amount: this.amount,
            expense: this.expense,
        });
    }

    showUp() {
        this.showModalChange.emit(this.showModal = !this.showModal)
    }

    handleSubmit() {
        const dataQuery = gql`
    mutation addExpense($title: String!,$status: String!,$amount: Float!,$token: String!,) {
    addExpense(
        title: $title,
        status: $status,
        amount: $amount,
        token: $token,
    )
}
    `
        this.apollo.mutate({
            mutation: dataQuery,
            variables: {
                title: this.addForm.value.title,
                amount: this.addForm.value.amount,
                status: this.addForm.value.expense,
                token: localStorage.getItem('token'),
            }
        }).subscribe((dataInfo) => {

            const responseMessages = dataInfo as { data: { addExpense: string } }
            if (dataInfo.data) {
                this.addForm.patchValue({
                    title: '',
                    amount: undefined,
                    expense: '',
                });

                this.messageErrorChange.emit(this.messageError = '')
                this.messageSuccessfulChange.emit(this.messageSuccessful = responseMessages.data?.addExpense)

                setTimeout(() => {
                    this.messageSuccessfulChange.emit(this.messageSuccessful = '')
                    this.showUp()
                    return this.data.fetchData();
                }, 3000)
            }
        }, ((error) => {
            if (!this.addForm.valid) {
                this.messageSuccessfulChange.emit(this.messageSuccessful = '')
                setTimeout(() => {
                    this.messageErrorChange.emit(this.messageError = '')
                }, 3000)
                return this.messageErrorChange.emit(this.messageError = 'All inputs are required')
            }

            this.messageSuccessfulChange.emit(this.messageSuccessful = '')
            this.messageErrorChange.emit(this.messageError = error.message)
            setTimeout(() => {
                this.messageErrorChange.emit(this.messageError = '')
            }, 3000)
        }))
    }
}