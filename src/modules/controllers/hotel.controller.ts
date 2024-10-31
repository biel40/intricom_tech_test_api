import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { HotelService } from '../services/hotel.service';
import { CreateHotelRequestDto } from '../models/dto/create_hotel_request.dto';
import { UpdateHotelRequestDto } from '../models/dto/update_hotel_request.dto';
import { Hotel } from '../models/database/hotel.entity';

@ApiTags('hotels')
@Controller('hotels')
export class HotelController {

  constructor(
    private readonly _hotelService: HotelService
  ) {

  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los registros de hoteles' })
  @ApiResponse({ status: 200, description: 'Lista de hoteles obtenida con éxito' })
  public async getAllHotels() : Promise<Hotel[]> {
    return this._hotelService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo hotel' })
  @ApiResponse({ status: 201, description: 'Hotel creado con éxito' })
  @ApiBody({
    description: 'Ejemplo de datos para crear un nuevo hotel',
    type: CreateHotelRequestDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de hotel',
        value: {
          name: 'Hotel California',
          address: 'Calle falsa 123',
        },
      },
    },
  })
  public async createHotel(
    @Body() createHotelDto: CreateHotelRequestDto
  ) {
    return this._hotelService.create(createHotelDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modificar un hotel ya existente' })
  @ApiResponse({ status: 200, description: 'Hotel actualizado con éxito' })
  public async updateHotel(
    @Param('id') id: string,
    @Body() updateHotelRequestDto: UpdateHotelRequestDto
  ) {
    return this._hotelService.update(id, updateHotelRequestDto);
  }
}
