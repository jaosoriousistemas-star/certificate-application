import { EnrollmentServices } from '../../services/enrollmentServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to update an existing enrollment.
 *
 * Extracts the enrollment id and the fields to update from the request body,
 * delegates the update to EnrollmentServices, and responds according to the outcome.
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.id
 * @param {string} [req.body.studentId]
 * @param {string} [req.body.groupId]
 * @param {string} [req.body.enrollmentDate]
 * @param {Object} res
 * @param {string} res.locals.newUserToken
 * @param {Function} next
 * @returns {Promise<void>}
 */
export const updateOneEnrollment = async (req, res, next) => {
  const { id } = req.body;
  const newEnrollmentData = {
    studentId: req.body.studentId,
    groupId: req.body.groupId,
    enrollmentDate: req.body.enrollmentDate,
  };

  const enrollmentManager = new EnrollmentServices();

  try {
    const response = await enrollmentManager.updateOne(id, newEnrollmentData);

    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'Matrícula actualizada exitosamente',
        authentication: res.locals.newUserToken,
      });
    }
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible actualizar la matrícula en la base de datos',
    });
    next(boomError);
  }
};
