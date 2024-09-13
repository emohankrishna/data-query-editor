export interface ITable {
    [key:string]:object
}
export interface IUser extends ITable {
    id: number
    name: string
    email: string
}



export interface ITicket extends ITable{
    id: number
    user_id: number
    description: string
}


export type IDatabase = {
    [key:string]:object[]
}