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
    readonly x: number = 0
    readonly y: number = 0
    price: BigNumberish
    newPrice: BigNumberish
    constructor(_x: number, _y: number, _price: BigNumberish, _newPrice: BigNumberish) {
        this.x = _x
        this.y = _y
        this.price = _price
        this.newPrice = _newPrice
    }
}