// import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
// import { MediaType } from "../enums/media.enums";

// @Entity("medias")
// export class MediaEntity {
    
//     @PrimaryGeneratedColumn()
//     media_id: number;
  
//     @Column({ type: 'varchar', length: 255, nullable: false })
//     source: string;

//     @Column({ type: 'enum', enum: MediaType, name: 'media_type', default: MediaType.OTHER})
//     media_type: MediaType;

//     @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
//     created_at: Date;

//     @Column({  type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
//     updated_at: Date;

// };