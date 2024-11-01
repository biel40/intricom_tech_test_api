import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { HotelBooking } from './hotel_booking.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Hotel')
export class Hotel {

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ example: 'Hotel California' })
    @Column({ type: 'text' })
    name: string;

    @ApiProperty({ example: '123 Sunset Blvd, Los Angeles' })
    @Column({ type: 'text' })
    address: string;

    @ApiProperty({ example: '2023-01-01T00:00:00Z' })
    @Column({ type: 'text' })
    createdDate: string;

    @ApiProperty({ type: () => [HotelBooking] })
    @OneToMany(() => HotelBooking, (hotelBooking) => hotelBooking.hotel)
    hotelBookings: HotelBooking[];
}