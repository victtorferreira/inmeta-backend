import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateEmployeeDocTypesDto } from './dto/update-employee-doc-types.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(id, dto);
  }

  @Put(':id/document-types')
  updateDocTypes(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDocTypesDto,
  ) {
    return this.employeesService.updateDocTypes(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }

  @Get(':id/status')
  getDocumentationStatus(@Param('id') id: string) {
    return this.employeesService.getDocumentationStatus(id);
  }

  @Delete(':id/document-types')
  removeDocTypes(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDocTypesDto,
  ) {
    return this.employeesService.removeDocTypes(id, dto);
  }
}
