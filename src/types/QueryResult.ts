export interface IUser {
    id: number
    name: string
    email: string
}



export interface ITicket{
    id: number
    user_id: number
    description: string
}

export type Table = IUser[] | ITicket[]


export type IDatabase = {
    [key:string]:object[]
}