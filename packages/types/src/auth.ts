export type USER = {
    id: number
    name: string
    email: string
}

export type User = USER

export type LOGIN_REQUEST = {
    email: string
    password: string
}
export type LOGIN_RESPONSE = {
    message: string,
    result?: USER
}

export type REGISTER_REQUEST = {
    name: string
    email: string
    password: string
    mobile: string
    profilePic?: string
}

export type REGISTER_RESPONSE = {
    message: string
    result?: USER
}
