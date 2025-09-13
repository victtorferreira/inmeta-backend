import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentType } from './entities/document-type.entity';

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly repo: Repository<DocumentType>,
  ) {}

  create(name: string) {
    const docType = this.repo.create({ name });
    return this.repo.save(docType);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const docType = await this.repo.findOne({ where: { id } });
    if (!docType) throw new NotFoundException('Document type not found');
    return docType;
  }

  async update(id: string, name: string) {
    const docType = await this.findOne(id);
    docType.name = name;
    return this.repo.save(docType);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Document type not found');
  }
}
