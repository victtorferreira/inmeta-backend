import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../documents/entities/documents.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Employee } from '../employees/entities/employee.entity';
import { DocumentType } from '../document-types/entities/document-type.entity';
import { PendingDocument } from './interfaces/pending-document.interface';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
  ) {}

  async create(dto: CreateDocumentDto) {
    const exists = await this.documentRepository.findOne({
      where: {
        employee: { id: dto.employeeId },
        documentType: { id: dto.documentTypeId },
      },
      relations: ['employee', 'documentType'],
    });

    if (exists) {
      throw new ConflictException(
        `A document of type "${exists.documentType.name}" already exists for this collaborator`,
      );
    }

    const document = this.documentRepository.create(dto);
    return this.documentRepository.save(document);
  }

  findAll(): Promise<Document[]> {
    return this.documentRepository.find({
      relations: ['employee', 'documentType'],
    });
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['employee', 'documentType'],
    });

    if (!document) throw new NotFoundException('Document not found');
    return document;
  }

  async update(id: string, data: UpdateDocumentDto): Promise<Document> {
    const document = await this.findOne(id);
    Object.assign(document, data);
    return this.documentRepository.save(document);
  }

  async updateStatus(
    id: string,
    status: 'PENDING' | 'SENT',
  ): Promise<Document> {
    const document = await this.findOne(id);
    document.status = status;
    return this.documentRepository.save(document);
  }

  async findAllPending(
    page = 1,
    limit = 10,
    employeeId?: string,
    documentTypeId?: string,
  ) {
    const skip = (page - 1) * limit;

    const employees = await this.employeeRepository.find({
      relations: ['documentTypes', 'documents', 'documents.documentType'],
    });

    let pendingList: PendingDocument[] = [];

    for (const emp of employees) {
      const requiredTypes = emp.documentTypes;
      const sentTypes = emp.documents
        .filter((doc) => doc.status === 'SENT')
        .map((doc) => doc.documentType.id);

      const pendingTypes = requiredTypes.filter(
        (req) => !sentTypes.includes(req.id),
      );

      for (const type of pendingTypes) {
        pendingList.push({
          employeeId: emp.id,
          employeeName: emp.name,
          documentTypeId: type.id,
          documentTypeName: type.name,
        });
      }
    }

    if (employeeId) {
      pendingList = pendingList.filter((p) => p.employeeId === employeeId);
    }
    if (documentTypeId) {
      pendingList = pendingList.filter(
        (p) => p.documentTypeId === documentTypeId,
      );
    }

    const total = pendingList.length;
    const paginated = pendingList.slice(skip, skip + limit);

    return { data: paginated, total, page, limit };
  }

  async remove(id: string): Promise<void> {
    const result = await this.documentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Document not found');
    }
  }
}
