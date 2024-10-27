import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Client')
export class Client {

    @PrimaryColumn()
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', })
    address: string;

    @Column({ type: 'text' })
    phone: string;

    @Column({ type: 'text'})
    createdDate: string;
}