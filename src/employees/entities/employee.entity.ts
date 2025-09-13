import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { DocumentType } from '../../document-types/entities/document-type.entity';
import { Document } from '../../documents/entities/documents.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  cpf: string;

  @CreateDateColumn({ type: 'timestamp' })
  hiredAt: Date;

  @ManyToMany(() => DocumentType, (dt) => dt.employees, { cascade: true })
  @JoinTable({ name: 'employees_document_types' })
  documentTypes: DocumentType[];

  @OneToMany(() => Document, (doc) => doc.employee)
  documents: Document[];
}
