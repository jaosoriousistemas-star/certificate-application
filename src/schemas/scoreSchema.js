// ─────────────────────────────────────────────────────────────────────────────
// SCORE SCHEMA — Joi Validation
// Entity: Score | Table: calificacion
// ─────────────────────────────────────────────────────────────────────────────
//
// Maps 1:1 to the public methods of ScoreServices. The frontend sends
// every value through the request body — never via URL params or query
// string — so every schema below is meant to be applied as
// validatorHandler(schema, 'body'), including the ones that only carry an
// id. Methods that take one or more primitive arguments on the service
// side (listOne, deleteOne, listBySubject, listByEnrollment,
// getBySubjectAndEnrollment) are still validated as a small object with
// one (or more) named keys, since Joi always validates an object shape.
//
// 'originalScore' and 'remedialScore' share the same format: either numeric
// (0.0 to 5.0) or alphabetic (Deficiente, Insuficiente, Aceptable,
// Sobresaliente, Excelente). The service layer enforces cross-field
// consistency with 'scoreType', so the schema only validates the shape.
// 'scoreType' is a fixed ENUM ('NUMERICA', 'ALFABETICA').
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  scoreId,
  scoreSubjectId,
  scoreEnrollmentId,
  scoreOriginalValue,
  scoreRemedialValue,
} from '../utils/RegEx/scoreRegEx.js';

// ── Primitive Joi types ─────────────────────────────────────────────────────

// Backs Score.id ('id_calificacion'). Kept as a string pattern, not
// Joi.number(), since scoreId is a digit-string RegEx.
const joiId = Joi.string().pattern(scoreId).messages({
  'string.base': 'El id debe ser una cadena de texto.',
  'string.pattern.base': 'El id debe contener solo dígitos (1 a 10 dígitos).',
});

// Backs Score.subjectId ('id_asignatura_calificacion'). Required.
const joiSubjectId = Joi.string().pattern(scoreSubjectId).messages({
  'string.base': 'El id de la asignatura debe ser una cadena de texto.',
  'string.pattern.base': 'El id de la asignatura debe contener solo dígitos (1 a 10 dígitos).',
});

// Backs Score.enrollmentId ('id_matricula_calificacion'). Required.
const joiEnrollmentId = Joi.string().pattern(scoreEnrollmentId).messages({
  'string.base': 'El id de la matrícula debe ser una cadena de texto.',
  'string.pattern.base': 'El id de la matrícula debe contener solo dígitos (1 a 10 dígitos).',
});

// Backs Score.scoreType ('tipo_nota_calificacion'). ENUM('NUMERICA','ALFABETICA').
const joiScoreType = Joi.string().valid('NUMERICA', 'ALFABETICA').messages({
  'string.base': 'El tipo de nota debe ser una cadena de texto.',
  'any.only': 'El tipo de nota debe ser "NUMERICA" o "ALFABETICA".',
});

// Backs Score.originalScore ('nota_original_calificacion').
// Accepts numeric (0.0–5.0) or alphabetic values; service validates consistency.
const joiOriginalScore = Joi.string().pattern(scoreOriginalValue).messages({
  'string.base': 'La nota original debe ser una cadena de texto.',
  'string.pattern.base': 'La nota original debe ser un número entre 0.0 y 5.0, o una de las siguientes: Deficiente, Insuficiente, Aceptable, Sobresaliente, Excelente.',
});

// Backs Score.remedialScore ('nota_habilitacion'). Same format as original.
const joiRemedialScore = Joi.string().pattern(scoreRemedialValue).messages({
  'string.base': 'La nota de habilitación debe ser una cadena de texto.',
  'string.pattern.base': 'La nota de habilitación debe ser un número entre 0.0 y 5.0, o una de las siguientes: Deficiente, Insuficiente, Aceptable, Sobresaliente, Excelente.',
});

// ── Schema export ────────────────────────────────────────────────────────────

export const scoreSchema = {

  // POST /scores/get-by-id (body: { id })
  // Validates ScoreServices.listOne(scoreId)
  getScoreById: Joi.object({
    id: joiId.required(),
  }),

  // GET /scores/list-all → no input parameters, no schema applied.

  // POST /scores/get-by-subject (body: { subjectId })
  // Validates ScoreServices.listBySubject(subjectId)
  listScoresBySubject: Joi.object({
    subjectId: joiSubjectId.required(),
  }),

  // POST /scores/get-by-enrollment (body: { enrollmentId })
  // Validates ScoreServices.listByEnrollment(enrollmentId)
  listScoresByEnrollment: Joi.object({
    enrollmentId: joiEnrollmentId.required(),
  }),

  // POST /scores/get-by-subject-and-enrollment (body: { subjectId, enrollmentId })
  // Validates ScoreServices.getBySubjectAndEnrollment(subjectId, enrollmentId)
  getScoreBySubjectAndEnrollment: Joi.object({
    subjectId: joiSubjectId.required(),
    enrollmentId: joiEnrollmentId.required(),
  }),

  // POST /scores (body: { originalScore, scoreType, subjectId, remedialScore, enrollmentId })
  // Validates ScoreServices.createOne(newScore). All fields required.
  newScoreData: Joi.object({
    originalScore: joiOriginalScore.required(),
    scoreType: joiScoreType.required(),
    subjectId: joiSubjectId.required(),
    remedialScore: joiRemedialScore.required(),
    enrollmentId: joiEnrollmentId.required(),
  }),

  // PATCH /scores (body: { id, originalScore?, scoreType?, subjectId?, remedialScore?, enrollmentId? })
  // Validates BOTH arguments of ScoreServices.updateOne(scoreId, newScoreData)
  // 'id' is always required; at least one mutable field must be present.
  updateScoreData: Joi.object({
    id: joiId.required(),
    originalScore: joiOriginalScore,
    scoreType: joiScoreType,
    subjectId: joiSubjectId,
    remedialScore: joiRemedialScore,
    enrollmentId: joiEnrollmentId,
  }).or('originalScore', 'scoreType', 'subjectId', 'remedialScore', 'enrollmentId').messages({
    'object.missing': 'Debe proporcionar al menos un campo para actualizar la calificación.',
  }),

  // DELETE /scores (body: { id })
  // Validates ScoreServices.deleteOne(scoreId)
  deleteScore: Joi.object({
    id: joiId.required(),
  }),

};
