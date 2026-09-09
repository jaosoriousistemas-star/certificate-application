import { SubjectServices } from '../../services/subjectServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to delete an existing subject.
 *
 * Extracts the subject id from the request body, delegates the deletion to
 * SubjectServices (which guards against subjects with associated scores),
 * and responds according to the outcome.
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see subjectSchema.deleteSubject).
 * @param {string} req.body.id - The id of the subject to delete.
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the operation result and the rotated token.
 */
export const deleteOneSubject = async (req, res, next) => {
  const { id } = req.body;
  const subjectManager = new SubjectServices();

  try {
    const response = await subjectManager.deleteOne(id);

    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'Asignatura eliminada exitosamente',
        authentication: res.locals.newUserToken,
      });
    }
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible eliminar la asignatura de la base de datos',
    });
    next(boomError);
  }
};
