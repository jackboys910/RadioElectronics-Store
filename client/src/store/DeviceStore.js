import { makeAutoObservable, runInAction } from 'mobx'

export default class DeviceStore {
  constructor() {
    this._types = []
    this._brands = []
    this._devices = []
    this._selectedType = {}
    this._selectedBrand = {}
    this._selectedDevice = null
    this._page = 1
    this._totalCount = 0
    this._limit = 8
    makeAutoObservable(this)
  }

  setTypes(types) {
    runInAction(() => {
      this._types = types
    })
  }
  setBrands(brands) {
    runInAction(() => {
      this._brands = brands
    })
  }
  setDevices(devices) {
    runInAction(() => {
      this._devices = Array.isArray(devices) ? devices : []
    })
  }

  setSelectedType(type) {
    runInAction(() => {
      this.setPage(1)
      this._selectedType = type
    })
  }

  setSelectedBrand(brand) {
    runInAction(() => {
      this.setPage(1)
      this._selectedBrand = brand
    })
  }

  setSelectedDevice(device) {
    runInAction(() => {
      this._selectedDevice = device
    })
  }

  setPage(page) {
    runInAction(() => {
      this._page = page
    })
  }

  setTotalCount(count) {
    runInAction(() => {
      this._totalCount = count
    })
  }

  get types() {
    return this._types
  }
  get brands() {
    return this._brands
  }
  get devices() {
    return this._devices
  }
  get selectedType() {
    return this._selectedType
  }
  get selectedBrand() {
    return this._selectedBrand
  }
  get selectedDevice() {
    return this._selectedDevice
  }
  get totalCount() {
    return this._totalCount
  }
  get page() {
    return this._page
  }
  get limit() {
    return this._limit
  }
}
