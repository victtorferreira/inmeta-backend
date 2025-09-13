import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateEmployeeDocTypesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  documentTypeIds: string[];
}
