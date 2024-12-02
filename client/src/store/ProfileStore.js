import { makeAutoObservable, runInAction } from 'mobx'

export default class ProfileStore {
  constructor() {
    this._profile = null
    this._loading = false
    this._error = null
    makeAutoObservable(this)
  }

  setProfile(profile) {
    runInAction(() => {
      this._profile = profile
    })
  }

  setLoading(loading) {
    runInAction(() => {
      this._loading = loading
    })
  }

  setError(error) {
    runInAction(() => {
      this._error = error
    })
  }

  get profile() {
    return this._profile
  }

  get loading() {
    return this._loading
  }

  get error() {
    return this._error
  }
}
