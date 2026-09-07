import { StudentServices } from '../../services/studentServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a student by its exact document number.
 *
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see studentSchema.getStudentByDocumentNumber).
 * @param {string} req.body.documentNumber - The document number to search for.
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the matching student and the rotated token.
 */
export const getStudentByDocumentNumber = async (req, res, next) => {
  const { documentNumber } = req.body;
  const studentManager = new StudentServices();

  try {
    const theStudent = await studentManager.listByDocumentNumber(documentNumber);

    return res.status(200).json({
      success: true,
      message: 'Estudiante encontrado exitosamente',
      student: theStudent,
      authentication: res.locals.newUserToken,
    });
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible encontrar el estudiante por número de documento',
    });
    next(boomError);
  }
};
