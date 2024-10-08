export class Login {
    email: string = "";

    password: string = "";
}

export class RegisterClass {
    userName: string = ""

    email: string = "";

    password: string = "";
}


export class User {
    id?: string = ""
    name: string = ""
    email: string = ""
    password: string = ""
    provider: 'GOOGLE' | 'CREDENTIAL' = "CREDENTIAL";
    isEmailVerified: boolean = false;
    profileImg: string = "";
    createdAt: Date = new Date();
}