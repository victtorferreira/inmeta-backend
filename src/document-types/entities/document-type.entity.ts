import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Document } from '../../documents/entities/documents.entity';

@Entity('document_types')
export class DocumentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Employee, (emp) => emp.documentTypes)
  employees: Employee[];

  @OneToMany(() => Document, (doc) => doc.documentType)
  documents: Document[];
}
