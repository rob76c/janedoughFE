export type User = {
    userId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    socialMediaHandle: string;
    image?:string;
}

export type SignUpParams = {
    username: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    socialMediaHandle?: string;
    checkout?: boolean;
    dialogId: string;
}

export type SignInResponse = {
    id: string;
    username: string;
    email: string;
    jwtToken: string;
    phoneNumber: string;
    roles: string[];
}


export type SignInParams = Omit<SignUpParams, 'username'| 'firstName'|'middleName' | 'lastName'| 'phoneNumber'|'socialMediaHandle'>;
export type SignInApiParams = Omit<SignInParams, 'dialogId' | 'checkout'>;