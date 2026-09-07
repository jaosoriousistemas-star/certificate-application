import { EnrollmentServices } from '../../services/enrollmentServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to create a new enrollment, linking a student to
 * a group on a given date.
 *
 * Extracts the new enrollment data from the request body, delegates the
 * creation to EnrollmentServices, and responds according to the outcome.
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.studentId
 * @param {string} req.body.groupId
 * @param {string} req.body.enrollmentDate
 * @param {Object} res
 * @param {string} res.locals.newUserToken
 * @param {Function} next
 * @returns {Promise<void>}
 */
export const createOneEnrollment = async (req, res, next) => {
  const newEnrollment = {
    studentId: req.body.studentId,
    groupId: req.body.groupId,
    enrollmentDate: req.body.enrollmentDate,
  };

  const enrollmentManager = new EnrollmentServices();

  try {
    const response = await enrollmentManager.createOne(newEnrollment);

    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Matrícula creada exitosamente',
        authentication: res.locals.newUserToken,
      });
    }
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible crear la matrícula en la base de datos',
    });
    next(boomError);
  }
};
