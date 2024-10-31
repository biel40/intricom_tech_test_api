import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ClientService } from '../services/client.service';
import { CreateClientRequestDto } from '../models/dto/create_client_request.dto';
import { Client } from '../models/database/client.entity';

@ApiTags('clients')
@Controller('clients')
export class ClientController {

  constructor(
    private readonly _clientService: ClientService
  ) {

  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los registros de clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida con éxito', type: Client, isArray: true })
  public async getAllClients() : Promise<Client[]> {
    return this._clientService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado con éxito' })
  @ApiBody({
    description: 'Ejemplo de datos para crear un nuevo cliente',
    type: CreateClientRequestDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de cliente',
        value: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '+1234567890'
        },
      },
    },
  })
  public async createClient(
    @Body() createClientDto: CreateClientRequestDto
  ) {
    return this._clientService.create(createClientDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modificar un cliente ya existente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado con éxito' })
  public async updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: any
  ) {
    return this._clientService.update(id, updateClientDto);
  }
}
