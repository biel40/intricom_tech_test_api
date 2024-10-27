import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ClientService } from '../services/client.service';
import { CreateClientRequestDto } from '../models/dto/create_client_request.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientController {

  constructor(
    private readonly _clientService: ClientService
  ) {

  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los registros de clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida con éxito' })
  public async getAllClients() {
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
          phone: '+1234567890',
          createdDate: '2024-10-27T12:34:56.000Z',
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
