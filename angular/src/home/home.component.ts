import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GlobalVariableService, IUser } from "../app/global-variable.service";
import { CounterComponent } from "../counter/counter.component";
import { EditExpenseComponent } from "../edit-expense/edit-expense.component";
import { Apollo, gql } from "apollo-angular";

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    standalone: true,
    imports: [CounterComponent, EditExpenseComponent],
})

export class HomeComponent implements OnInit {
    constructor(private data: GlobalVariableService, private apollo: Apollo) { }

    @Input() dataInfo: IUser = { getExpense: [], getUser: { _id: '', first_name: '', last_name: '', email: '', username: '' } }
    @Output() dataInfoChange = new EventEmitter<IUser>()

    @Input() totalDebit: number = 0
    @Output() totalDebitChange = new EventEmitter<number>()

    @Input() totalCredit: number = 0
    @Output() totalCreditChange = new EventEmitter<number>()

    @Input() totalPrice: number = 0
    @Output() totalPriceChange = new EventEmitter<number>()

    @Input() clientName: string = ''
    @Output() clientNameChange = new EventEmitter<string>()

    setDate(time: number) {
        const date = new Date(Number(time)).toDateString()
        return date;
    }

    ngOnInit(): void {
        this.data.userInfoSubject.asObservable().subscribe((data) => {
            this.totalDebit = 0;
            this.totalCredit = 0;
            this.totalPrice = 0;

            const getDataInfo = data as IUser
            this.dataInfoChange.emit(this.dataInfo = getDataInfo);
            this.clientNameChange.emit(this.clientName = this.dataInfo?.getUser?.first_name as string + ' ' + this.dataInfo?.getUser?.last_name as string)
            if (getDataInfo.getUser._id && getDataInfo.getExpense.length > 0) {
                for (let i of getDataInfo.getExpense) {
                    if (i.status === 'debit') {
                        this.totalDebitChange.emit(this.totalDebit += i.amount);
                    }
                }
                for (let i of getDataInfo.getExpense) {
                    if (i.status === 'credit') {
                        this.totalCreditChange.emit(this.totalCredit += i.amount);
                    }
                }
                this.totalPriceChange.emit(this.totalPrice = this.totalDebit - this.totalCredit);
            } else {
                this.totalDebitChange.emit(this.totalDebit = 0);
                this.totalCreditChange.emit(this.totalCredit = 0);
                this.totalPriceChange.emit(this.totalPrice = 0);
                this.clientNameChange.emit(this.clientName = '')
                this.dataInfoChange.emit(this.dataInfo = { getExpense: [], getUser: { _id: '', first_name: '', last_name: '', email: '', username: '' } })
            }
        });
    }

    handleDelete(task_id: string) {
        const confirmStatus = confirm('Are you sure to delete this expense')
        if (confirmStatus) {
            const formQuery = gql`
            mutation DeleteExpense($token:String!,$task_id:String!) {
        deleteExpense(token: $token, task_id: $task_id)
            }
            `

            this.apollo.mutate({
                mutation: formQuery,
                variables: {
                    token: localStorage.getItem('token'),
                    task_id: task_id,
                }
            }).subscribe((dataInfo) => {
                console.log(dataInfo);
                this.data.fetchData()
            })
        }
    }

}