import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './documents.controller';
import { DocumentService } from './documents.service';
import { Document } from './entities/documents.entity';
import { Employee } from '../employees/entities/employee.entity';
import { DocumentType } from '../document-types/entities/document-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Employee, DocumentType])],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentsModule {}
