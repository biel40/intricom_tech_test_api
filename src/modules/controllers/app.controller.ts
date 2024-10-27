import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { FileSystemService } from '../services/file_system.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller('app')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly _fileSystemService: FileSystemService,
  ) {

  }

  @Get('dataTypeConfig')
  @ApiOperation({ summary: 'Obtiene el tipo de configuración de datos de la aplicación.' })
  @ApiResponse({ status: 200, description: 'Tipo de configuración de datos de la aplicación obtenido con éxito.' })
  public getDataTypeConfig(): string {
    return `El tipo de configuración de la aplicación es: ${this._fileSystemService.getFileDataTypeConfig()}`;
  }

  
  @Get('fileSystemPath')
  @ApiOperation({ summary: 'Obtiene el fileSystemPath de las variables de entorno.' })
  @ApiResponse({ status: 200, description: 'Variable de entorno del fileSystemPath obtenida con éxito.' })
  public getTestFileSystemPath(): string {
    return `El fileSystemPath obtenido es: ${this._fileSystemService.getFileSystemPath()}`;
  }
}
