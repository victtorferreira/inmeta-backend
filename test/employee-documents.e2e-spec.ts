import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Employee to Employee Document Flow (E2E)', () => {
  let app: INestApplication;
  let server: any;

  let employeeId: string;
  let cpfTypeId: string;
  let carteiraTypeId: string;
  let cpfDocumentId: string;

  // Gera CPF aleatório para evitar duplicidade
  const generateRandomCpf = () =>
    Math.floor(10000000000 + Math.random() * 90000000000).toString();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  it('Must create a collaborator', async () => {
    const res = await request(server)
      .post('/employees')
      .send({
        name: 'João da Silva',
        cpf: generateRandomCpf(), // CPF único
        hiredAt: '2025-09-11',
      })
      .expect(201);

    employeeId = res.body.id;
    expect(employeeId).toBeDefined();
  });

  it('You must create document types (CPF and Work Card))', async () => {
    const cpfRes = await request(server)
      .post('/document-types')
      .send({ name: 'CPF' })
      .expect(201);

    cpfTypeId = cpfRes.body.id;

    const carteiraRes = await request(server)
      .post('/document-types')
      .send({ name: 'Carteira de Trabalho' })
      .expect(201);

    carteiraTypeId = carteiraRes.body.id;
  });

  it('Must link mandatory documents to the employee', async () => {
    expect(employeeId).toBeDefined();
    await request(server)
      .put(`/employees/${employeeId}/document-types`)
      .send({ documentTypeIds: [cpfTypeId, carteiraTypeId] })
      .expect(200);
  });

  it('You must create a CPF document for the employee', async () => {
    const res = await request(server)
      .post('/documents')
      .send({
        title: 'Documento CPF',
        content: 'Representação do CPF',
        employeeId,
        documentTypeId: cpfTypeId,
      })
      .expect(201);

    cpfDocumentId = res.body.id;
    expect(cpfDocumentId).toBeDefined();
  });

  it('You must mark the CPF document as sent.', async () => {
    expect(cpfDocumentId).toBeDefined();
    await request(server)
      .put(`/documents/${cpfDocumentId}/status`)
      .send({ status: 'SENT' })
      .expect(200);
  });

  it('You must check the status and verify your CPF sent and your Wallet pending.', async () => {
    const res = await request(server)
      .get(`/employees/${employeeId}/status`)
      .expect(200);

    expect(res.body.sent).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: cpfTypeId, name: 'CPF' }),
      ]),
    );

    expect(res.body.pending).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: carteiraTypeId,
          name: 'Carteira de Trabalho',
        }),
      ]),
    );
  });

  it('Must update collaborator', async () => {
    const res = await request(server)
      .put(`/employees/${employeeId}`)
      .send({
        name: 'João Atualizado',
        cpf: generateRandomCpf(), // CPF único
      })
      .expect(200);

    expect(res.body.name).toBe('João Atualizado');
    expect(res.body.cpf).toBeDefined();
  });

  it('Must unlink document type (Work Card))', async () => {
    await request(server)
      .delete(`/employees/${employeeId}/document-types`)
      .send({ documentTypeIds: [carteiraTypeId] })
      .expect(200);

    const res = await request(server)
      .get(`/employees/${employeeId}`)
      .expect(200);

    expect(res.body.documentTypes).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: carteiraTypeId })]),
    );
  });

  it('Must list pending items from all collaborators with filter by collaborator', async () => {
    const res = await request(server)
      .get(`/documents/pending/all?employeeId=${employeeId}&page=1&limit=10`)
      .expect(200);

    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
