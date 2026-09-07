// ─────────────────────────────────────────────────────────────────────────────
// ENROLLMENT SCHEMA — Joi Validation
// Entity: Enrollment | Table: matricula
// ─────────────────────────────────────────────────────────────────────────────
//
// Maps 1:1 to the public methods of EnrollmentServices. The frontend sends
// every value through the request body — never via URL params or query
// string — so every schema below is meant to be applied as
// validatorHandler(schema, 'body'), including the ones that only carry an
// id. Methods that take one or more primitive arguments on the service
// side (listOne, deleteOne, listByStudent, listByGroup,
// getByStudentAndGroup) are still validated as a small object with one
// (or more) named keys, since Joi always validates an object shape.
//
// 'enrollmentDate' (DATEONLY) is validated with Joi.date() rather than a
// RegEx pattern, per the NOTE in utils/RegEx/enrollmentRegEx.js — a
// text-based pattern can only check the format/range of a date, not
// whether it is a real calendar date, so Joi's native date validation is
// used instead.
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  enrollmentId,
  enrollmentStudentId,
  enrollmentGroupId,
} from '../utils/RegEx/enrollmentRegEx.js';

// ── Primitive Joi types ─────────────────────────────────────────────────────

// Backs Enrollment.id ('id_matricula'). Kept as a string pattern, not
// Joi.number(), since enrollmentId is a digit-string RegEx.
const joiId = Joi.string().pattern(enrollmentId).messages({
  'string.base': 'El id debe ser una cadena de texto.',
  'string.pattern.base': 'El id debe contener solo dígitos (1 a 10 dígitos).',
});

// Backs Enrollment.studentId ('id_estudiante_matricula'), the foreign
// key to Student. Nullable at the database level (SET NULL on delete),
// but this service layer requires it at creation time as a business
// rule — see the EnrollmentServices class JSDoc.
const joiStudentId = Joi.string().pattern(enrollmentStudentId).messages({
  'string.base': 'El id del estudiante debe ser una cadena de texto.',
  'string.pattern.base': 'El id del estudiante debe contener solo dígitos (1 a 10 dígitos).',
});

// Backs Enrollment.groupId ('id_grupo_matricula'), the foreign key to
// Group. Nullable at the database level (SET NULL on delete), but this
// service layer requires it at creation time as a business rule.
const joiGroupId = Joi.string().pattern(enrollmentGroupId).messages({
  'string.base': 'El id del grupo debe ser una cadena de texto.',
  'string.pattern.base': 'El id del grupo debe contener solo dígitos (1 a 10 dígitos).',
});

// Backs Enrollment.enrollmentDate ('fecha_matricula'). Validated as a
// native Joi date rather than a RegEx pattern, since Joi.date() checks
// real calendar validity (format-only patterns would accept impossible
// dates such as '2024-02-30').
const joiEnrollmentDate = Joi.date().messages({
  'date.base': 'La fecha de matrícula debe ser una fecha válida.',
});

// ── Schema export ────────────────────────────────────────────────────────────

export const enrollmentSchema = {

  // POST /enrollments/get-by-id (body: { id })
  // Validates EnrollmentServices.listOne(enrollmentId)
  getEnrollmentById: Joi.object({
    id: joiId.required(),
  }),

  // GET /enrollments/list-all → no input parameters, no schema applied.

  // POST /enrollments/get-by-student (body: { studentId })
  // Validates EnrollmentServices.listByStudent(studentId). Supports
  // building a student's full academic history.
  listEnrollmentsByStudent: Joi.object({
    studentId: joiStudentId.required(),
  }),

  // POST /enrollments/get-by-group (body: { groupId })
  // Validates EnrollmentServices.listByGroup(groupId). Supports listing
  // the roster of a group.
  listEnrollmentsByGroup: Joi.object({
    groupId: joiGroupId.required(),
  }),

  // POST /enrollments/get-by-student-and-group (body: { studentId, groupId })
  // Validates EnrollmentServices.getByStudentAndGroup(studentId, groupId).
  // Used to check whether a student is already enrolled in a group.
  getEnrollmentByStudentAndGroup: Joi.object({
    studentId: joiStudentId.required(),
    groupId: joiGroupId.required(),
  }),

  // POST /enrollments (body: { studentId, groupId, enrollmentDate })
  // Validates EnrollmentServices.createOne(newEnrollment). All three
  // fields are required at the service layer as a business rule, even
  // though 'studentId'/'groupId' are nullable at the database level.
  newEnrollmentData: Joi.object({
    studentId: joiStudentId.required(),
    groupId: joiGroupId.required(),
    enrollmentDate: joiEnrollmentDate.required(),
  }),

  // PATCH /enrollments (body: { id, studentId?, groupId?, enrollmentDate? })
  // Validates BOTH arguments of EnrollmentServices.updateOne(enrollmentId,
  // newEnrollmentData) in a single object, since the frontend sends the id
  // inside the body rather than as a route param. 'id' is always
  // required; at least one mutable field must also be present so the
  // request carries something to update.
  updateEnrollmentData: Joi.object({
    id: joiId.required(),
    studentId: joiStudentId,
    groupId: joiGroupId,
    enrollmentDate: joiEnrollmentDate,
  }).or('studentId', 'groupId', 'enrollmentDate').messages({
    'object.missing': 'Debe proporcionar al menos uno de los campos studentId, groupId o enrollmentDate para actualizar la matrícula.',
  }),

  // DELETE /enrollments (body: { id })
  // Validates EnrollmentServices.deleteOne(enrollmentId)
  deleteEnrollment: Joi.object({
    id: joiId.required(),
  }),

};
