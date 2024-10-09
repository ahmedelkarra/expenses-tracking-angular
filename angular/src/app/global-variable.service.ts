import { EventEmitter, Injectable, Input, Output } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';

interface IExpenseInfo {
  _id: string;
  authorId: string;
  title: string;
  status: string;
  amount: number;
  createdAt: number;
}

interface IUserInfo {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

export interface IUser {
  getExpense: IExpenseInfo[], getUser: IUserInfo
}

@Injectable({
  providedIn: 'root',
})
export class GlobalVariableService {

  userInfoSubject: BehaviorSubject<IUser> = new BehaviorSubject<IUser>({ getExpense: [], getUser: { _id: '', first_name: '', last_name: '', email: '', username: '' } });

  isUserSubject: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor(private readonly apollo: Apollo) { }

  fetchData(): void {
    const token = localStorage.getItem('token');

    const testData = this.apollo.watchQuery({
      errorPolicy: 'all',
      query: gql`
        query getUserAndExpense($token: String!) {
          getUser(token: $token) {
            _id
            first_name
            last_name
            email
            username
          }
          getExpense(token: $token) {
            _id
            title
            status
            amount
            authorId
            createdAt
          }
        }
      `,
      variables: {
        token: token
      },
      fetchPolicy: 'network-only',
    })
    testData.valueChanges.subscribe(result => {
      if (result.data) {
        const resultData = result as { data: IUser }
        this.isUserSubject.next(true)
        return this.userInfoSubject.next(resultData.data)
      }
      this.userInfoSubject.next({ getExpense: [], getUser: { _id: '', first_name: '', last_name: '', email: '', username: '' } })
      return this.isUserSubject.next(false)
    }, ((error) => {
      this.userInfoSubject.next({ getExpense: [], getUser: { _id: '', first_name: '', last_name: '', email: '', username: '' } })
      return this.isUserSubject.next(false)
    }));
  }
}
