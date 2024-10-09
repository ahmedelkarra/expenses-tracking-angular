import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Apollo, gql, MutationResult } from "apollo-angular";
import { GraphQLError } from 'graphql'
import { GlobalVariableService } from "../app/global-variable.service";
import { Router, RouterLink } from "@angular/router";
import { MessageErrorComponent } from "../messageError/messageError.component";
import { MessageSuccessfulComponent } from "../messageSuccessful/messageSuccessful.component";

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, MessageErrorComponent, MessageSuccessfulComponent, RouterLink],
})

export class RegisterComponent {

    constructor(private apollo: Apollo, private data: GlobalVariableService, private router: Router) { }

    @Input() messageError: string = ''
    @Output() messageErrorChange = new EventEmitter<string>()

    @Input() messageSuccessful: string = ''
    @Output() messageSuccessfulChange = new EventEmitter<string>()

    registerFrom = new FormGroup({
        first_name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
        last_name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
        email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(30)]),
        username: new FormControl('', [Validators.required, Validators.maxLength(30)]),
        password: new FormControl('', [Validators.required]),
        confirm_password: new FormControl('', [Validators.required]),
    })

    handleSubmit() {
        if (!this.registerFrom.valid) {
            this.messageSuccessfulChange.emit(this.messageSuccessful = '')
            setTimeout(() => {
                this.messageErrorChange.emit(this.messageError = '')
            }, 3000)
            return this.messageErrorChange.emit(this.messageError = 'All inputs are required')
        }

        const register = gql`
      mutation AddUser($first_name: String!, $last_name: String!,$username: String!, $email: String!,$password: String!,$confirm_password:String!) {
        addUser(first_name: $first_name, last_name: $last_name,username: $username,email: $email ,password: $password,confirm_password:$confirm_password) {
          message
          token
        }
      }
        `
        this.apollo.mutate({
            mutation: register,
            variables: {
                first_name: this.registerFrom.value.first_name,
                last_name: this.registerFrom.value.last_name,
                email: this.registerFrom.value.email,
                username: this.registerFrom.value.username,
                password: this.registerFrom.value.password,
                confirm_password: this.registerFrom.value.confirm_password,
            }
        }).subscribe((dataInfo) => {
            if (dataInfo.data) {
                const dataMessage = dataInfo as { data: { addUser: { token: string, message: string } } }
                localStorage.setItem('token', dataMessage.data.addUser.token)
                this.messageErrorChange.emit(this.messageError = '')
                this.messageSuccessfulChange.emit(this.messageSuccessful = dataMessage.data.addUser.message)
                setTimeout(() => {
                    this.messageSuccessfulChange.emit(this.messageSuccessful = '')
                    this.router.navigate(['/'])
                    return this.data.fetchData();
                }, 3000)
            }
        }, ((error: GraphQLError) => {
            this.messageSuccessfulChange.emit(this.messageSuccessful = '')
            this.messageErrorChange.emit(this.messageError = error.message)
            setTimeout(() => {
                this.messageErrorChange.emit(this.messageError = '')
            }, 3000)
        }))
    }
}