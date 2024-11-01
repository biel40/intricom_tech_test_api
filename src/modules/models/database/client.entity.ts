import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { HotelBooking } from './hotel_booking.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Client')
export class Client {

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ example: 'John Doe' })
    @Column({ type: 'text' })
    name: string;

    @ApiProperty({ example: '123 Main St, Springfield' })
    @Column({ type: 'text' })
    address: string;

    @ApiProperty({ example: '+123456789' })
    @Column({ type: 'text' })
    phone: string;

    @ApiProperty({ example: '2023-01-01T00:00:00Z' })
    @Column({ type: 'text' })
    createdDate: string;

    @ApiProperty({ type: () => [HotelBooking] })
    @OneToMany(() => HotelBooking, (hotelBooking) => hotelBooking.client)
    hotelBookings: HotelBooking[];
}