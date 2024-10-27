import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileSystemService {

    private fileDataTypeConfig: string;
    private fsFolder: string;

    constructor(
        private configService: ConfigService,
    ) {
        this.fileDataTypeConfig = this.configService.get<string>('DATA_TYPE');
        this.fsFolder = this.configService.get<string>('FS_FOLDER');
    }

    public getFileDataTypeConfig(): string {
        return this.fileDataTypeConfig;
    }

    public getFileSystemPath(): string {
        return this.fsFolder;
    }
}
