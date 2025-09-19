import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as isUUIDValidate, version as uuidVersion } from 'uuid';

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  constructor(private readonly uuidVer: 1 | 3 | 4 | 5 = 4) {} // дефолтна версія 4

  transform(value: string) {
    if (!isUUIDValidate(value) || uuidVersion(value) !== this.uuidVer) {
      throw new BadRequestException(`Id must be a valid UUID v${this.uuidVer}`);
    }
    return value;
  }
}
