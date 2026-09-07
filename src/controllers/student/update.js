import { StudentServices } from '../../services/studentServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to update an existing student.
 *
 * Extracts the student id and the fields to update from the request body,
 * delegates the update to StudentServices, and responds according to the outcome.
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see studentSchema.updateStudentData).
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the operation result and the rotated token.
 */
export const updateOneStudent = async (req, res, next) => {
  const { id } = req.body;
  const newStudentData = {
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
    const response = await studentManager.updateOne(id, newStudentData);

    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'Estudiante actualizado exitosamente',
        authentication: res.locals.newUserToken,
      });
    }
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible actualizar el estudiante en la base de datos',
    });
    next(boomError);
  }
};
