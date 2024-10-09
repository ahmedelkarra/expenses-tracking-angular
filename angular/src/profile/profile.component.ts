import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GlobalVariableService, IUser } from "../app/global-variable.service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { MessageErrorComponent } from "../messageError/messageError.component";
import { MessageSuccessfulComponent } from "../messageSuccessful/messageSuccessful.component";
import { GraphQLError } from "graphql";
import { Router } from "@angular/router";


@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, MessageErrorComponent, MessageSuccessfulComponent],
})

export class ProfileComponent implements OnInit {
    constructor(private data: GlobalVariableService, private apollo: Apollo, private router: Router) { }

    @Input() isUser: boolean = false
    @Output() isUserChange = new EventEmitter<boolean>()

    @Input() messageError: string = ''
    @Output() messageErrorChange = new EventEmitter<string>()

    @Input() messageSuccessful: string = ''
    @Output() messageSuccessfulChange = new EventEmitter<string>()

    profileForm = new FormGroup({
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        new_password: new FormControl('', Validators.required),
        confirm_new_password: new FormControl('', Validators.required),
    })

    ngOnInit(): void {
        this.data.isUserSubject.asObservable().subscribe((isUser) => {
            this.isUserChange.emit(this.isUser = isUser)
        })
        this.data.userInfoSubject.subscribe((dataInfo) => {
            this.profileForm.patchValue({
                first_name: dataInfo?.getUser?.first_name || "",
                last_name: dataInfo?.getUser?.last_name || "",
                email: dataInfo?.getUser?.email || "",
                username: dataInfo?.getUser?.username || "",
            })
        })
    }

    handleSubmit() {
        const dataQuery = gql`
        mutation EditUser($token:String!,$first_name:String!,$last_name:String!,$email:String!,$username:String!,$password:String!,$new_password:String!,$confirm_new_password:String!,) {
        editUser(
            token: $token
            first_name: $first_name
            last_name: $last_name
            email: $email
            username: $username
            password: $password
            new_password: $new_password
            confirm_new_password: $confirm_new_password
    )
}
        `

        this.apollo.mutate({
            mutation: dataQuery,
            variables: {
                token: localStorage.getItem('token'),
                first_name: this.profileForm.value.first_name,
                last_name: this.profileForm.value.last_name,
                email: this.profileForm.value.email,
                username: this.profileForm.value.username,
                password: this.profileForm.value.password,
                new_password: this.profileForm.value.new_password || '',
                confirm_new_password: this.profileForm.value.confirm_new_password || '',
            }
        }).subscribe((dataInfo) => {
            const finalValue = dataInfo as { data: { editUser: string } }

            if (dataInfo.data) {
                this.messageErrorChange.emit(this.messageError = '')
                this.messageSuccessfulChange.emit(this.messageSuccessful = finalValue.data?.editUser)
                setTimeout(() => {
                    this.messageSuccessfulChange.emit(this.messageSuccessful = '')
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

    handleDelete() {
        const dataQuery = gql`
        mutation DeleteUser($token:String!,$password:String!) {
            deleteUser(
            token: $token
            password: $password
    )
}
        `

        this.apollo.mutate({
            mutation: dataQuery,
            variables: {
                token: localStorage.getItem('token'),
                password: this.profileForm.value.password,
            }
        }).subscribe((dataInfo) => {
            const finalValue = dataInfo as { data: { deleteUser: string } }
            if (dataInfo.data) {
                this.messageErrorChange.emit(this.messageError = '')
                this.messageSuccessfulChange.emit(this.messageSuccessful = finalValue.data?.deleteUser)
                setTimeout(() => {
                    localStorage.removeItem('token');
                    this.router.navigate(['/'])
                    this.messageSuccessfulChange.emit(this.messageSuccessful = '')
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