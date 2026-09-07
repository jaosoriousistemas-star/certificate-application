// ────────────────────────────────────────────────────────────────────────────
// STUDENT ROUTER
// Entity: Student | Table: estudiante
//
// Defines and exposes the HTTP endpoints used to manage the "student"
// entity. This is a core domain entity; routes are protected and only
// users with appropriate roles are allowed to operate on it.
//
// Security pipeline applied to each route:
//   1. validatorHandler(schema, 'body') → validates the incoming payload
//   2. checkApiKey → verifies the client app's API key.
//   3. authAppVerifyToken → validates the session JWT and rotates it.
//   4. checkRole([...]) → authorizes only the allowed roles.
//   5. controller → executes the business operation.
//
// Mounted at: /app/v1/students  (see src/routes/index.js)
// ────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';

// ── Middlewares ─────────────────────────────────────────────────────────────

import { validatorHandler } from '../middlewares/validatorHandler.js';
import { checkApiKey } from '../middlewares/apiAuthHandler.js';
import { authAppVerifyToken } from '../middlewares/tokenHandlers/authAppTokenHandler.js';
import { checkRole } from '../middlewares/checkRoleHandler.js';

// ── Validation schema ───────────────────────────────────────────────────────

import { studentSchema } from '../schemas/studentSchema.js';

// ── Controllers ─────────────────────────────────────────────────────────────

import { createOneStudent } from '../controllers/student/create.js';
import { updateOneStudent } from '../controllers/student/update.js';
import { deleteOneStudent } from '../controllers/student/delete.js';
import { listOneStudent } from '../controllers/student/listOne.js';
import { listAllStudents } from '../controllers/student/listAll.js';
import { searchStudentsByName } from '../controllers/student/searchByName.js';
import { getStudentByDocumentNumber } from '../controllers/student/getByDocumentNumber.js';
import { listStudentsByMunicipality } from '../controllers/student/listByMunicipality.js';
import { listStudentsByDocumentType } from '../controllers/student/listByDocumentType.js';

// Create a new Router instance dedicated to the student resource
const studentRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /create  →  Create a new student
// Body: { firstName, middleName?, firstLastName, secondLastName?,
//         documentNumber?, birthDate, municipalityId,
//         documentTypeId?, genderId?, address?, email? }
// ─────────────────────────────────────────────────────────────────────────────
studentRouter.post(
  '/create',
  checkApiKey,
  validatorHandler(studentSchema.newStudentData, 'body'),
  authAppVerifyToken,
  checkRole(['Máster', 'Administrador']),
  createOneStudent
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-all  →  List every student
// Body: {} (no payload to validate)
// ─────────────────────────────────────────────────────────────────────────────
studentRouter.get(
  '/list-all',
  checkApiKey,
  authAppVerifyToken,
  checkRole(['Máster', 'Administrador', 'Rector', 'Funcionario', 'Auxiliar']),
  listAllStudents
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /list-one  →  Retrieve a single student by id
// Body: { id }
// ─────────────────────────────────────────────────────────────────────────────
studentRouter.get(
  '/list-one',
  checkApiKey,
  validatorHandler(studentSchema.getStudentById, 'body'),
  authAppVerifyToken,
  checkRole(['Máster', 'Administrador']),
  listOneStudent
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /search-by-name  →  Search students by partial name (first or last)
// Body: { partialName }
// ─────────────────────────────────────────────────────────────────────────────
studentRouter.post(
  '/search-by-name',
  checkApiKey,
  validatorHandler(studentSchema.searchStudentsByName, 'body'),
  authAppVerifyToken,
  checkRole(['Máster', 'Administrador']),
  searchStudentsByName
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /get-by-document-number  →  Retrieve a student by exact document number
// Body: { documentNumber }
// ─────────────────────────────────────────────────────────────────────────────
studentRouter.post(
  '/get-by-document-number',
  checkApiKey,
  validatorHandler(studentSchema.getStudentByDocumentNumber, 'body'),
  authAppVerifyToken,
  checkRole(['Máster', 'Administrador']),
  getStudentByDocumentNumber
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /get-by-municipality  →  List students by municipality
// Body: { municipalityId }
// ─────────────────────────────────────────────────────────────────────────────
studentRouter.post(
  '/get-by-municipality',
  checkApiKey,
  validatorHandler(studentSchema.listStudentsByMunicipality, 'body'),
  authAppVerifyToken,
  checkRole(['Máster', 'Administrador']),
  listStudentsByMunicipality
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /get-by-document-type  →  List students by document type
// Body: { documentTypeId }
// ─────────────────────────────────────────────────────────────────────────────
studentRouter.post(
  '/get-by-document-type',
  checkApiKey,
  validatorHandler(studentSchema.listStudentsByDocumentType, 'body'),
  authAppVerifyToken,
  checkRole(['Máster', 'Administrador']),
  listStudentsByDocumentType
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /update  →  Update an existing student
// Body: { id, firstName?, middleName?, firstLastName?, secondLastName?,
//         documentNumber?, birthDate?, municipalityId?, documentTypeId?,
//         genderId?, address?, email? }
// ─────────────────────────────────────────────────────────────────────────────
studentRouter.patch(
  '/update',
  checkApiKey,
  validatorHandler(studentSchema.updateStudentData, 'body'),
  authAppVerifyToken,
  checkRole(['Máster', 'Administrador']),
  updateOneStudent
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /delete  →  Delete a student by id
// Body: { id }
// ─────────────────────────────────────────────────────────────────────────────
studentRouter.delete(
  '/delete',
  checkApiKey,
  validatorHandler(studentSchema.deleteStudent, 'body'),
  authAppVerifyToken,
  checkRole(['Máster', 'Administrador']),
  deleteOneStudent
);

export default studentRouter;
