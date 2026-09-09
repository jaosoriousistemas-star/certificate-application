import { SubjectServices } from '../../services/subjectServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single subject by its id.
 *
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see subjectSchema.getSubjectById).
 * @param {string} req.body.id - The id of the subject to retrieve.
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the requested subject and the rotated token.
 */
export const listOneSubject = async (req, res, next) => {
  const { id } = req.body;
  const subjectManager = new SubjectServices();

  try {
    const theSubject = await subjectManager.listOne(id);

    return res.status(200).json({
      success: true,
      message: 'Asignatura encontrada exitosamente',
      subject: theSubject,
      authentication: res.locals.newUserToken,
    });
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible consultar la asignatura en la base de datos',
    });
    next(boomError);
  }
};
