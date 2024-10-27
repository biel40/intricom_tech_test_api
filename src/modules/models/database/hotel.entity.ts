import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { HotelBooking } from './hotel_booking.entity';

@Entity('Hotel')
export class Hotel {

    @PrimaryColumn()
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    address: string;

    @Column({ type: 'text' })
    createdDate: string;

    @OneToMany(() => HotelBooking, (hotelBooking) => hotelBooking.hotel)
    hotelBookings: HotelBooking[];
}