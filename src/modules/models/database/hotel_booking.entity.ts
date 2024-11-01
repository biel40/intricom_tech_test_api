import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hotel } from './hotel.entity';
import { Client } from './client.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('HotelBooking')
export class HotelBooking {

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ example: 'Booking Name' })
    @Column({ type: 'text' })
    name: string;

    @ApiProperty({ example: '123 Main St, Springfield' })
    @Column({ type: 'text', })
    address: string;

    @ApiProperty({ example: '2023-01-01T00:00:00Z' })
    @Column({ type: 'text' })
    createdDate: string;

    @ApiProperty({ type: () => Hotel })
    @ManyToOne(() => Hotel, (hotel) => hotel.hotelBookings, { eager: true })
    @JoinColumn({ name: 'hotelId' })
    hotel: Hotel;

    @ApiProperty({ type: () => Client })
    @ManyToOne(() => Client, (client) => client.hotelBookings, { eager: true })
    @JoinColumn({ name: 'clientId' })
    client: Client;
}