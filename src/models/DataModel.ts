import { BigNumberish } from "ethers";

export class UserModel {
    address: any
    balance: BigNumberish = 0.0
    constructor(_address: any, _balance: BigNumberish) {
        this.address = _address
        this.balance = _balance
    }
}

export class CellModel {
    x: number = 0
    y: number = 0
    lastPrice: BigNumberish = 0.0
    constructor(_x: number, _y: number, _lastPrice: BigNumberish) {
        this.x = _x
        this.y = _y
        this.lastPrice = _lastPrice
    }
}