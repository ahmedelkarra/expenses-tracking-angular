import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { GlobalVariableService } from "../app/global-variable.service";

@Component({
    selector: 'app-header',
    templateUrl: 'header.componet.html',
    standalone: true,
    imports: [RouterLink],
})

export class HeaderComponet {
    constructor(private data: GlobalVariableService, private route: Router) { }

    @Input() isUser: boolean = false
    @Output() isUserChange = new EventEmitter<boolean>()

    @Input() showMenu: boolean = false
    @Output() showMenuChange = new EventEmitter<boolean>()

    @Input() showMenuSmall: boolean = false
    @Output() showMenuSmallChange = new EventEmitter<boolean>()

    @Input() nameInfo: string = ''
    @Output() nameInfoChange = new EventEmitter<string>()

    showMenuFunction() {
        this.showMenuChange.emit(this.showMenu = !this.showMenu)
    }

    showMenuSmallFunction() {
        this.showMenuSmallChange.emit(this.showMenuSmall = !this.showMenuSmall)
    }

    handleLogout() {
        localStorage.removeItem('token')
        this.showMenuChange.emit(this.showMenu = !this.showMenu)
        this.showMenuFunction()
        this.showMenuSmallFunction()
        this.data.fetchData()
        return this.route.navigate(['/'])
    }

    ngOnInit(): void {
        this.data.userInfoSubject.subscribe((dataInfo) => {
            this.nameInfoChange.emit(this.nameInfo = dataInfo.getUser.first_name[0]?.toUpperCase() + dataInfo.getUser.last_name[0]?.toUpperCase())
        })

        this.data.isUserSubject.asObservable().subscribe((isUser) => {
            this.isUserChange.emit(this.isUser = isUser)
        })
    }
}