import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GlobalVariableService } from "../app/global-variable.service";
import { Apollo, gql } from "apollo-angular";
import { MessageErrorComponent } from "../messageError/messageError.component";
import { MessageSuccessfulComponent } from "../messageSuccessful/messageSuccessful.component";


@Component({
    selector: 'app-edit-expense',
    templateUrl: 'edit-expense.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, MessageErrorComponent, MessageSuccessfulComponent]
})

export class EditExpenseComponent implements OnInit {
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

    editForm = new FormGroup({
        task_id: new FormControl<string>('', [Validators.required]),
        title: new FormControl<string>('', [Validators.required, Validators.maxLength(30)]),
        amount: new FormControl<number>(0, [Validators.required]),
        expense: new FormControl<string>('', [Validators.required]),
    });

    ngOnInit(): void {
        this.editForm.patchValue({
            task_id: this.task_id,
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
    mutation EditExpense($title: String!,$status: String!,$amount: Float!,$task_id: String!,$token: String!,) {
    editExpense(
        title: $title,
        status: $status,
        amount: $amount,
        task_id: $task_id,
        token: $token,
    )
}
    `
        this.apollo.mutate({
            mutation: dataQuery,
            variables: {
                task_id: this.editForm.value.task_id,
                title: this.editForm.value.title,
                amount: this.editForm.value.amount,
                status: this.editForm.value.expense,
                token: localStorage.getItem('token'),
            }
        }).subscribe((dataInfo) => {
            const responseMessages = dataInfo as { data: { editExpense: string } }
            if (dataInfo.data) {
                this.messageErrorChange.emit(this.messageError = '')
                this.messageSuccessfulChange.emit(this.messageSuccessful = responseMessages.data?.editExpense)

                setTimeout(() => {
                    this.messageSuccessfulChange.emit(this.messageSuccessful = '')
                    this.showUp()
                    return this.data.fetchData();
                }, 3000)
            }
        }, ((error) => {
            if (!this.editForm.valid) {
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