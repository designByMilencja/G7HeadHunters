export interface AdminEntity {
    email: string;
    password: string;
    token: string;
    role: string;
}
export interface UserEntity extends AdminEntity {
    active: boolean;
    status: string;
}
