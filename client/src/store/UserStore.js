import { makeAutoObservable, runInAction } from 'mobx'

export default class UserStore {
  constructor() {
    this._isAuth = false
    this._user = {}
    makeAutoObservable(this)
  }

  setIsAuth(bool) {
    runInAction(() => {
      this._isAuth = bool
    })
  }
  setUser(user) {
    runInAction(() => {
      this._user = user
    })
  }

  get isAuth() {
    return this._isAuth
  }
  get user() {
    return this._user
  }

  get role() {
    return this._user.role
  }
}
