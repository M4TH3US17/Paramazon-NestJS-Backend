import { MediaType } from "../../enums/media.enums";
import { Status, UserRole } from "../../enums/user.enum";

export interface IUserResponse {
    user_id: number;
    username: string;
    user_role: UserRole;
    created_at: Date;
    updated_at: Date;
    photograph_fk?: number;
    photograph: IMediaResponse;
};

export interface IMediaResponse {
    media_id: number;
    source: string;
    created_at: Date;
    updated_at: Date;
};

export interface IMediaEntity extends IMediaResponse {
    media_type: MediaType;
};

export interface IUserEntity extends IUserResponse {
    password: string;
    account_status: Status;
};