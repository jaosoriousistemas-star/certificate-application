import { EnrollmentServices } from '../../services/enrollmentServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single enrollment by its id.
 *
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
export const listOneEnrollment = async (req, res, next) => {
  const { id } = req.body;
  const enrollmentManager = new EnrollmentServices();

  try {
    const theEnrollment = await enrollmentManager.listOne(id);

    return res.status(200).json({
      success: true,
      message: 'Matrícula encontrada exitosamente',
      enrollment: theEnrollment,
      authentication: res.locals.newUserToken,
    });
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible consultar la matrícula en la base de datos',
    });
    next(boomError);
  }
};
