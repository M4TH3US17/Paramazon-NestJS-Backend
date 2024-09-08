// import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
// import { MediaEntity } from "./media.entity";
// import { UserRole } from "../enums/user.enum";

// @Entity("users")
// export class UserEntity {
    
//     @PrimaryGeneratedColumn()
//     user_id: number;
  
//     @Column({ type: 'varchar', length: 70, nullable: false, unique: true })
//     username: string;

//     @Column({ type: 'varchar', length: 70, nullable: false })
//     password: string;

//     @Column({ type: 'enum', enum: UserRole, name: 'user_role', default: UserRole.USER })
//     user_role: UserRole;

//     @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
//     created_at: Date;

//     @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
//     updated_at: Date;

//     @Column({ name: 'account_status', type: 'enum', enum: ['active', 'inactive'], default: 'active' })
//     account_status: 'active' | 'inactive';

//     @JoinColumn()
//     @OneToOne(() => MediaEntity)
//     photograph_fk: MediaEntity;

// };