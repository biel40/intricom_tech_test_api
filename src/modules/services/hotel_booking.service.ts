import { Injectable } from '@nestjs/common';
import { FileSystemService } from './file_system.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { HotelBooking } from '../models/database/hotel_booking.entity';
import { CreateHotelBookingRequestDto } from '../models/dto/create_hotel_booking_request.dto';
import { HotelService } from './hotel.service';
import { ClientService } from './client.service';
import { Hotel } from '../models/database/hotel.entity';
import { Client } from '../models/database/client.entity';

@Injectable()
export class HotelBookingService {

    private dataType: string;
    private fsFolder: string;
    private baseFolder: string = path.join(__dirname, '..', '..', '..', 'data');
    private entityFolder: string;
    private metadataFile: string;

    constructor(
        private _fileSystemService: FileSystemService,

        @InjectRepository(HotelBooking)
        private _hotelBookingRepository: Repository<HotelBooking>,

        private _hotelService: HotelService,
        private _clientService: ClientService
    ) {
        this.dataType = this._fileSystemService.getFileDataTypeConfig();
        this.fsFolder = this._fileSystemService.getFileSystemPath();
        this.entityFolder = path.join(this.baseFolder, 'HotelBooking');
        this.metadataFile = path.join(this.entityFolder, '_metadata.json');

        if (this.dataType === 'FS') {
            this._initializeFileSystem();
        }
    }

    /**
     * Método público para obtener todos los registros de clientes
     * @returns Promise<any>
     * @memberof HotelBookingService
     * @public
     * @async
     * @method findAll
    */
    public async findAll() : Promise<HotelBooking[]> {
        if (this.dataType === 'FS' || this.dataType === 'fs' || this.dataType === 'FileSystem') {
            let bookingsFromFs = this._findAllFromFileSystem();

            return bookingsFromFs;
        } else {
            return this._findAllFromDatabase();
        }
    }

    /**
     * Método público para crear un nuevo registro de cliente
     * @param data Datos del cliente a crear
     * @returns Promise<any>
     * @memberof ClientService
     * @public
     * @async
     * @method create
    */
    public async create(data: CreateHotelBookingRequestDto) {
        if (this.dataType === 'FS') {
            console.log('Creando en FileSystem...');
            return this._createInFileSystem(data);
        } else {
            return this._createInDatabase(data);
        }
    }

    /**
     * Método público para actualizar un registro de cliente ya existente
     * @param id Identificador del cliente a actualizar
     * @param data Datos del cliente a actualizar
     * @returns Promise<any>
     * @memberof ClientService
     * @public
     * @async
     * @method update
    */
    public async update(id: string, data: any) {
        if (this.dataType === 'FS') {
            return this._updateInFileSystem(id, data);
        } else {
            return this._updateInDatabase(id, data);
        }
    }

    // Métodos privados específicos para la lógica de FileSystem
    private _initializeFileSystem() {
        if (!fs.existsSync(this.entityFolder)) {
            fs.mkdirSync(this.entityFolder, { recursive: true });
        }
        if (!fs.existsSync(this.metadataFile)) {
            const initialMetadata = { TOTAL_REGISTRIES: 0, LAST_INDEX: 0 };
            fs.writeFileSync(this.metadataFile, JSON.stringify(initialMetadata, null, 2));
        }
    }

    private  _findAllFromFileSystem() : Promise<HotelBooking[]> {
        const files = fs.readdirSync(this.entityFolder).filter((file) => file !== '_metadata.json');

        return Promise.all(files.map(async (file) => {
            const content = fs.readFileSync(path.join(this.entityFolder, file), 'utf-8');

            let contentParsed: any = JSON.parse(content);
            const allHotels = await this._hotelService.findAll();

            let hotel: Hotel = allHotels.find((hotel) => Number(hotel.id) === Number(contentParsed.hotelId));

            const allClients = await this._clientService.findAll();
            let client: Client = allClients.find((client) => Number(client.id) === Number(contentParsed.clientId));
            
            let hotelBookingCompleteInfo = {
                ...JSON.parse(content),
                hotel: hotel,
                client: client
            };

            return hotelBookingCompleteInfo;
        }));
    }

    private readMetadata() {
        const metadata = fs.readFileSync(this.metadataFile, 'utf-8');
        return JSON.parse(metadata);
    }

    private updateMetadata(totalRegistries: number, lastIndex: number) {
        const updatedMetadata = { TOTAL_REGISTRIES: totalRegistries, LAST_INDEX: lastIndex };
        fs.writeFileSync(this.metadataFile, JSON.stringify(updatedMetadata, null, 2));
    }

    private _createInFileSystem(data: any) {
        const metadata = this.readMetadata();

        const newId = metadata.LAST_INDEX + 1;

        metadata.TOTAL_REGISTRIES += 1;
        metadata.LAST_INDEX = newId;

        const filePath = path.join(this.entityFolder, `${newId}.json`);
        fs.writeFileSync(filePath, JSON.stringify({ id: newId, ...data }, null, 2));

        this.updateMetadata(metadata.TOTAL_REGISTRIES, metadata.LAST_INDEX);

        console.log('Cliente creado en FileSystem satisfactoriamente.');
        return { id: newId, ...data };
    }

    private _updateInFileSystem(id: string, data: any) {
        const metadata = this.readMetadata();

        const filePath = path.join(this.entityFolder, `${id}.json`);

        if (fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({ id, ...data }, null, 2));
            console.log('Cliente actualizado en FileSystem satisfactoriamente.');
            return { id, ...data };
        } else {
            console.log('Cliente no encontrado en FileSystem.');
            return { message: 'Cliente no encontrado en FileSystem.' };
        }
    }


    // Métodos específicos para BB.DD
    private _findAllFromDatabase() : Promise<HotelBooking[]> {
        try {
            let clients = this._hotelBookingRepository.find();

            return clients;
        } catch (error) {
            throw new Error('Error al obtener los clientes de la base de datos.');
        }
    }

    private async _createInDatabase(data: any) {
        try {
            const newClient = this._hotelBookingRepository.create(data);
            await this._hotelBookingRepository.save(newClient);

            console.log('Cliente creado en la base de datos satisfactoriamente.');
            return newClient;
        } catch (error) {
            console.error('Error al crear el cliente en la base de datos:', error);
            return { message: 'Error al crear el cliente en la base de datos.' };
        }
    }

    private async _updateInDatabase(id: string, data: any) {
        try {
            const client = await this._hotelBookingRepository.findOneBy({ id: id });

            if (!client) {
                console.log('Cliente no encontrado en la base de datos.');
                return { message: 'Cliente no encontrado en la base de datos.' };
            }

            await this._hotelBookingRepository.update(id, data);

            console.log('Cliente actualizado en la base de datos satisfactoriamente.');

            return { id, ...data };
        } catch (error) {
            console.error('Error al actualizar el cliente en la base de datos:', error);
            return { message: 'Error al actualizar el cliente en la base de datos.' };
        }
    }
}
