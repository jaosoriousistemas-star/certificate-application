import { StudentServices } from '../../services/studentServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to create a new student.
 *
 * Extracts the new student data from the request body, delegates the creation
 * to StudentServices, and responds according to the outcome.
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see studentSchema.newStudentData).
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the operation result and the rotated token.
 */
export const createOneStudent = async (req, res, next) => {
  const newStudent = {
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    firstLastName: req.body.firstLastName,
    secondLastName: req.body.secondLastName,
    documentNumber: req.body.documentNumber,
    birthDate: req.body.birthDate,
    municipalityId: req.body.municipalityId,
    documentTypeId: req.body.documentTypeId,
    genderId: req.body.genderId,
    address: req.body.address,
    email: req.body.email,
  };

  const studentManager = new StudentServices();

  try {
    const response = await studentManager.createOne(newStudent);

    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Estudiante creado exitosamente',
        authentication: res.locals.newUserToken,
      });
    }
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible crear el estudiante en la base de datos',
    });
    next(boomError);
  }
};
