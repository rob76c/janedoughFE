export type User = {
    userId: string;
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    socialMediaHandle: string;
    image?:string;
}

export type SignUpParams = {
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    socialMediaHandle?: string;
    password: string;
    checkout?: boolean;
    dialogId: string;
}

export type SignInParams = Omit<SignUpParams, 'username'| 'name'|'phoneNumber'|'socialMediaHandle'>;
