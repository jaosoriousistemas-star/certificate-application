// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT SCHEMA — Joi Validation
// Entity: Subject | Table: asignatura
// ─────────────────────────────────────────────────────────────────────────────
//
// Maps 1:1 to the public methods of SubjectServices. The frontend sends
// every value through the request body — never via URL params or query
// string — so every schema below is meant to be applied as
// validatorHandler(schema, 'body'), including the ones that only carry an
// id. Methods that take a single primitive argument on the service side
// (listOne, deleteOne, listByPartialName) are still validated as a small
// object with one named key, since Joi always validates an object shape.
//
// Subject name is free‑text (not a closed ENUM), so a partial‑text search
// endpoint exists here, unlike DocumentType or Gender.
// ─────────────────────────────────────────────────────────────────────────────

import Joi from 'joi';

import {
  subjectId,
  subjectName,
  subjectDescription,
  subjectHourlyIntensity,
} from '../utils/RegEx/subjectRegEx.js';

// ── Primitive Joi types ─────────────────────────────────────────────────────

// Backs Subject.id ('id_asignatura'). Kept as a string pattern, not
// Joi.number(), since subjectId is a digit-string RegEx.
const joiId = Joi.string().pattern(subjectId).messages({
  'string.base': 'El id debe ser una cadena de texto.',
  'string.pattern.base': 'El id debe contener solo dígitos (1 a 10 dígitos).',
});

// Backs Subject.name ('nombre_asignatura')
const joiName = Joi.string().pattern(subjectName).messages({
  'string.base': 'El nombre de la asignatura debe ser una cadena de texto.',
  'string.pattern.base': 'El nombre de la asignatura debe tener entre 3 y 20 caracteres y contener solo letras y espacios.',
});

// Backs Subject.description ('descripcion_asignatura')
const joiDescription = Joi.string().pattern(subjectDescription).messages({
  'string.base': 'La descripción de la asignatura debe ser una cadena de texto.',
  'string.pattern.base': 'La descripción debe tener entre 3 y 50 caracteres y contener solo letras, números, espacios, puntos, comas y guiones.',
});

// Backs Subject.hourlyIntensity ('intensidad_horaria')
const joiHourlyIntensity = Joi.string().pattern(subjectHourlyIntensity).messages({
  'string.base': 'La intensidad horaria debe ser una cadena de texto.',
  'string.pattern.base': 'La intensidad horaria debe ser un solo dígito entre 1 y 9.',
});

// ── Schema export ────────────────────────────────────────────────────────────

export const subjectSchema = {

  // POST /subjects/get-by-id (body: { id })
  // Validates SubjectServices.listOne(subjectId)
  getSubjectById: Joi.object({
    id: joiId.required(),
  }),

  // GET /subjects/list-all → no input parameters, no schema applied.

  // POST /subjects/search-by-name (body: { partialName })
  // Validates SubjectServices.listByPartialName(partialName)
  searchSubjectsByName: Joi.object({
    partialName: joiName.required(),
  }),

  // POST /subjects (body: { name, description, hourlyIntensity })
  // Validates SubjectServices.createOne(newSubject). All fields required.
  newSubjectData: Joi.object({
    name: joiName.required(),
    description: joiDescription.required(),
    hourlyIntensity: joiHourlyIntensity.required(),
  }),

  // PATCH /subjects (body: { id, name?, description?, hourlyIntensity? })
  // Validates BOTH arguments of SubjectServices.updateOne(subjectId, newSubjectData)
  // 'id' is always required; at least one mutable field must be present.
  updateSubjectData: Joi.object({
    id: joiId.required(),
    name: joiName,
    description: joiDescription,
    hourlyIntensity: joiHourlyIntensity,
  }).or('name', 'description', 'hourlyIntensity').messages({
    'object.missing': 'Debe proporcionar al menos un campo para actualizar la asignatura.',
  }),

  // DELETE /subjects (body: { id })
  // Validates SubjectServices.deleteOne(subjectId)
  deleteSubject: Joi.object({
    id: joiId.required(),
  }),

};
