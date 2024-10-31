import { Injectable } from '@nestjs/common';
import { FileSystemService } from './file_system.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Hotel } from '../models/database/hotel.entity';
import { CreateHotelRequestDto } from '../models/dto/create_hotel_request.dto';

@Injectable()
export class HotelService {

    private dataType: string;
    private fsFolder: string;
    private baseFolder: string = path.join(__dirname, '..', '..', '..', 'data');
    private entityFolder: string;
    private metadataFile: string;

    constructor(
        private _fileSystemService: FileSystemService,

        @InjectRepository(Hotel)
        private _hotelRepository: Repository<Hotel>,
    ) {
        this.dataType = this._fileSystemService.getFileDataTypeConfig();
        this.fsFolder = this._fileSystemService.getFileSystemPath();
        this.entityFolder = path.join(this.baseFolder, 'Hotel');
        this.metadataFile = path.join(this.entityFolder, '_metadata.json');

        if (this.dataType === 'FS') {
            this._initializeFileSystem();
        }
    }

    /**
     * Método público para obtener todos los registros de hoteles
     * @returns Promise<any>
     * @memberof HotelService
     * @public
     * @async
     * @method findAll
    */
    public async findAll() : Promise<Hotel[]> {
        if (this.dataType === 'FS' || this.dataType === 'fs' || this.dataType === 'FileSystem') {
            return this._findAllFromFileSystem();
        } else {
            return this._findAllFromDatabase();
        }
    }

    /**
     * Método público para crear un nuevo registro de hotel
     * @param data Datos del hotel a crear
     * @returns Promise<any>
     * @memberof HotelService
     * @public
     * @async
     * @method create
    */
    public async create(data: CreateHotelRequestDto) {
        if (this.dataType === 'FS') {
            return this._createInFileSystem(data);
        } else {
            return this._createInDatabase(data);
        }
    }

    /**
     * Método publico para actualizar un registro ya existente de hotel
     * @param id Identificador del hotel a actualizar
     * @param data Datos del hotel a actualizar
     * @returns Promise<any>
     * @memberof HotelService
     * @public
     * @async
     * @method update
     * @throws Error
     * */
    public async update(id: string, data: any) {
        if (this.dataType === 'FS') {
            return this._updateInFileSystem(id, data);
        } else {
            return this._updateInDatabase(id, data);
        }
    }

    private _initializeFileSystem() {
        if (!fs.existsSync(this.baseFolder)) {
            fs.mkdirSync(this.baseFolder);
        }

        if (!fs.existsSync(this.entityFolder)) {
            fs.mkdirSync(this.entityFolder);
        }

        if (!fs.existsSync(this.metadataFile)) {
            fs.writeFileSync(this.metadataFile, JSON.stringify({
                lastId: 0,
                entities: []
            }));
        }
    }

    private _findAllFromFileSystem() {
        const files = fs.readdirSync(this.entityFolder).filter((file) => file !== '_metadata.json');

        return files.map((file) => {
            const content = fs.readFileSync(path.join(this.entityFolder, file), 'utf-8');
            return JSON.parse(content);
        });
    }

    private _findAllFromDatabase(): Promise<Hotel[]> {
        return this._hotelRepository.find();
    }

    private readMetadata() {
        const metadata = fs.readFileSync(this.metadataFile, 'utf-8');
        return JSON.parse(metadata);
    }

    private updateMetadata(totalRegistries: number, lastIndex: number) {
        const updatedMetadata = { TOTAL_REGISTRIES: totalRegistries, LAST_INDEX: lastIndex };
        fs.writeFileSync(this.metadataFile, JSON.stringify(updatedMetadata, null, 2));
    }

    private _createInFileSystem(data: CreateHotelRequestDto) {
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
        return new Promise((resolve, reject) => {
            const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf-8'));
            const index = metadata.entities.findIndex((entity: any) => entity.id === parseInt(id, 10));

            if (index === -1) {
                reject(new Error('Entity not found'));
            }

            metadata.entities[index] = {
                ...metadata.entities[index],
                ...data
            };

            fs.writeFileSync(this.metadataFile, JSON.stringify(metadata, null, 2));

            resolve(metadata.entities[index]);
        });
    }

    private _createInDatabase(data: CreateHotelRequestDto) {
        return this._hotelRepository.save(data);
    }

    private _updateInDatabase(id: string, data: any) {
        return this._hotelRepository.update(id, data);
    }
}
