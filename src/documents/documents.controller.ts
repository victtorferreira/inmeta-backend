import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { DocumentService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  create(@Body() data: CreateDocumentDto) {
    return this.documentService.create(data);
  }

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @Get('pending/all')
  findAllPending(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('employeeId') employeeId?: string,
    @Query('documentTypeId') documentTypeId?: string,
  ) {
    return this.documentService.findAllPending(
      Number(page),
      Number(limit),
      employeeId,
      documentTypeId,
    );
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateDocumentDto) {
    return this.documentService.update(id, data);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'PENDING' | 'SENT',
  ) {
    return this.documentService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(id);
  }
}
