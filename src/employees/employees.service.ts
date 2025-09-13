import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { DocumentType } from '../document-types/entities/document-type.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateEmployeeDocTypesDto } from './dto/update-employee-doc-types.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepo: Repository<Employee>,
    @InjectRepository(DocumentType)
    private docTypesRepo: Repository<DocumentType>,
  ) {}

  async create(dto: CreateEmployeeDto) {
    const employee = this.employeesRepo.create({
      ...dto,
      hiredAt: dto.hiredAt ?? new Date(),
    });
    return this.employeesRepo.save(employee);
  }

  async findAll() {
    return this.employeesRepo.find({ relations: ['documentTypes'] });
  }

  async findOne(id: string) {
    const employee = await this.employeesRepo.findOne({
      where: { id },
      relations: ['documentTypes', 'documents'],
    });
    if (!employee) throw new NotFoundException(`Employee ID ${id} not found`);
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);
    Object.assign(employee, dto);
    return this.employeesRepo.save(employee);
  }

  async updateDocTypes(id: string, dto: UpdateEmployeeDocTypesDto) {
    const employee = await this.findOne(id);

    const docTypes = await this.docTypesRepo.find({
      where: { id: In(dto.documentTypeIds) },
    });

    if (docTypes.length !== dto.documentTypeIds.length) {
      throw new NotFoundException('One or more document types were not found');
    }

    employee.documentTypes = docTypes;
    return this.employeesRepo.save(employee);
  }

  async remove(id: string) {
    const employee = await this.findOne(id);
    return this.employeesRepo.remove(employee);
  }

  async getDocumentationStatus(id: string) {
    const employee = await this.employeesRepo.findOne({
      where: { id },
      relations: ['documentTypes', 'documents', 'documents.documentType'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const requiredTypes = employee.documentTypes;

    const sentTypes = employee.documents
      .filter((doc) => doc.status === 'SENT')
      .map((doc) => doc.documentType);

    const pendingTypes = requiredTypes.filter(
      (req) => !sentTypes.some((sent) => sent.id === req.id),
    );

    return {
      employee: {
        id: employee.id,
        name: employee.name,
      },
      sent: sentTypes,
      pending: pendingTypes,
    };
  }

  async removeDocTypes(id: string, dto: UpdateEmployeeDocTypesDto) {
    const employee = await this.findOne(id);

    employee.documentTypes = employee.documentTypes.filter(
      (docType) => !dto.documentTypeIds.includes(docType.id),
    );

    return this.employeesRepo.save(employee);
  }
}
