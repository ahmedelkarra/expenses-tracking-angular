import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Apollo, gql, Mutation, MutationResult } from "apollo-angular";
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalVariableService } from "../app/global-variable.service";
import { Router, RouterLink } from "@angular/router";
import { GraphQLError } from "graphql";
import { MessageErrorComponent } from "../messageError/messageError.component";
import { MessageSuccessfulComponent } from "../messageSuccessful/messageSuccessful.component";

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, MessageErrorComponent, MessageSuccessfulComponent, RouterLink],
})
export class LoginComponent implements OnInit {

    @Input() isUser: boolean = false
    @Output() isUserChange = new EventEmitter<boolean>()

    @Input() messageError: string = ''
    @Output() messageErrorChange = new EventEmitter<string>()

    @Input() messageSuccessful: string = ''
    @Output() messageSuccessfulChange = new EventEmitter<string>()

    constructor(private apollo: Apollo, private data: GlobalVariableService, private router: Router) { }

    loginForm = new FormGroup({
        username: new FormControl('ahmedgo', Validators.required),
        password: new FormControl('12369870', Validators.required),
    });

    loginMutation() {
        const login = gql`
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          message
          token
        }
      }
    `;

        this.apollo.mutate({
            mutation: login,
            variables: {
                username: this.loginForm.value.username,
                password: this.loginForm.value.password
            }
        }).subscribe((res) => {

            const responseMessages = res as MutationResult<{ login: { token: string, message: string } }>;
            if (responseMessages.data) {
                localStorage.setItem('token', responseMessages.data?.login.token as string);

                this.data.isUserSubject.asObservable().subscribe((isUser) => {
                    this.isUserChange.emit(this.isUser = isUser);
                });

                this.messageErrorChange.emit(this.messageError = '')
                this.messageSuccessfulChange.emit(this.messageSuccessful = responseMessages.data?.login.message)
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

    ngOnInit(): void {
        this.data.isUserSubject.asObservable().subscribe((isUser) => {
            this.isUserChange.emit(this.isUser = isUser);
        });
    }
}
