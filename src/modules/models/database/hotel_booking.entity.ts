import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hotel } from './hotel.entity';
import { Client } from './client.entity';

@Entity('HotelBooking')
export class HotelBooking {

    @PrimaryColumn()
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', })
    address: string;

    @Column({ type: 'text' })
    createdDate: string;

    @ManyToOne(() => Hotel, (hotel) => hotel.hotelBookings, { eager: true })
    @JoinColumn({ name: 'hotelId' })
    hotel: Hotel;

    @ManyToOne(() => Client, (client) => client.hotelBookings, { eager: true })
    @JoinColumn({ name: 'clientId' })
    client: Client;
}