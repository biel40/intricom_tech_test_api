import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { HotelBookingService } from '../services/hotel_booking.service';
import { CreateHotelBookingRequestDto } from '../models/dto/create_hotel_booking_request.dto';
import { UpdateHotelBookingRequestDto } from '../models/dto/update_hotel_booking_request.dto';
import { HotelBooking } from '../models/database/hotel_booking.entity';

@ApiTags('hotelBookings')
@Controller('hotelBookings')
export class HotelBookingController {

    constructor(
        private readonly _hotelBookingService: HotelBookingService
    ) {

    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los registros de las reservas' })
    @ApiResponse({ status: 200, description: 'Lista de reservas obtenida con éxito' })
    public async getAllBookings() : Promise<HotelBooking[]> {
        return this._hotelBookingService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Crear una nueva reserva' })
    @ApiResponse({ status: 201, description: 'Reserva creada con éxito' })
    @ApiBody({
        description: 'Ejemplo de datos para crear una nueva reserva',
        type: CreateHotelBookingRequestDto,
        examples: {
            ejemplo: {
                summary: 'Ejemplo de una reserva',
                value: {
                    hotelId: '1',
                    name: 'Reserva de prueba',
                    address: 'Calle falsa 123',
                    createdDate: '2021-06-01',
                    clientId: '1'
                },
            },
        },
    })
    public async createBooking(
        @Body() createHotelBookingDto: CreateHotelBookingRequestDto
    ) {
        return this._hotelBookingService.create(createHotelBookingDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Modificar una reserva ya existente' })
    @ApiResponse({ status: 200, description: 'Reserva actualizada con éxito' })
    public async updateHotelBooking(
        @Param('id') id: string,
        @Body() updateHotelBookingDto: UpdateHotelBookingRequestDto
    ) {
        // return this._clientService.update(id, updateClientDto);
    }
}
