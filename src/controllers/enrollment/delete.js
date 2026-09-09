import { EnrollmentServices } from '../../services/enrollmentServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to delete an existing enrollment.
 *
 * Extracts the enrollment id from the request body, delegates the deletion to
 * EnrollmentServices (which guards against enrollments with an associated
 * certificate or scores), and responds according to the outcome.
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.id
 * @param {Object} res
 * @param {string} res.locals.newUserToken
 * @param {Function} next
 * @returns {Promise<void>}
 */
export const deleteOneEnrollment = async (req, res, next) => {
  const { id } = req.body;
  const enrollmentManager = new EnrollmentServices();

  try {
    const response = await enrollmentManager.deleteOne(id);

    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'Matrícula eliminada exitosamente',
        authentication: res.locals.newUserToken,
      });
    }
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible eliminar la matrícula de la base de datos',
    });
    next(boomError);
  }
};
