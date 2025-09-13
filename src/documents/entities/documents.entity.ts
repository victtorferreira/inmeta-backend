import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { DocumentType } from '../../document-types/entities/document-type.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ type: 'enum', enum: ['PENDING', 'SENT'], default: 'PENDING' })
  status: 'PENDING' | 'SENT';

  @ManyToOne(() => Employee, (emp) => emp.documents)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @ManyToOne(() => DocumentType, (dt) => dt.documents)
  @JoinColumn({ name: 'documentTypeId' })
  documentType: DocumentType;
}
