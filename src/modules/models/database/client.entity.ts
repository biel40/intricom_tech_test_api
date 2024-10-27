import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { HotelBooking } from './hotel_booking.entity';

@Entity('Client')
export class Client {

    @PrimaryColumn()
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    address: string;

    @Column({ type: 'text' })
    phone: string;

    @Column({ type: 'text' })
    createdDate: string;

    @OneToMany(() => HotelBooking, (hotelBooking) => hotelBooking.client)
    hotelBookings: HotelBooking[];
}