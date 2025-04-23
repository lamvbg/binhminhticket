import { AbstractEntity } from "src/common/entities";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tour extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column( {nullable: true} )
    tourName: string;
    
    @Column()
    tourDescription: string;

    @Column( {nullable: true} )
    tourPrice: string;

    @Column( {nullable: true} )
    tourDuration: string;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column( {nullable: true} )
    available_seats: number;
}