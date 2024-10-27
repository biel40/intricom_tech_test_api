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
        this.entityFolder = path.join(this.baseFolder, 'Client');
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
    public async findAll() {
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
        return new Promise((resolve, reject) => {
            const data = fs.readFileSync(this.metadataFile, 'utf-8');
            const metadata = JSON.parse(data);
            const entities = metadata.entities;

            resolve(entities);
        });
    }

    private _findAllFromDatabase() {
        return this._hotelRepository.find();
    }

    private _createInFileSystem(data: CreateHotelRequestDto) {
        return new Promise((resolve, reject) => {
            const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf-8'));
            const newEntity = {
                id: metadata.lastId + 1,
                ...data
            };

            metadata.lastId++;
            metadata.entities.push(newEntity);

            fs.writeFileSync(this.metadataFile, JSON.stringify(metadata, null, 2));

            resolve(newEntity);
        });
    }

    private _createInDatabase(data: CreateHotelRequestDto) {
        return this._hotelRepository.save(data);
    }
}
