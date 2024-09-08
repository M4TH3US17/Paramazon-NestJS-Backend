import { UserRole } from "../../enums/user.enum";

export interface UserResponse {
    user_id: number;
    username: string;
    user_role: UserRole;
    created_at: Date;
    updated_at: Date;
    photograph_fk: MediaResponse;
};

interface MediaResponse {
    media_id: number;
    source: string;
};