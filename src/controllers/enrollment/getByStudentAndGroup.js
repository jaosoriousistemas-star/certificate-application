import { EnrollmentServices } from '../../services/enrollmentServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve the single enrollment (if any) linking
 * a specific student to a specific group. Useful to check whether a
 * student is already enrolled in a group before attempting a new enrollment.
 *
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.studentId
 * @param {string} req.body.groupId
 * @param {Object} res
 * @param {string} res.locals.newUserToken
 * @param {Function} next
 * @returns {Promise<void>}
 */
export const getEnrollmentByStudentAndGroup = async (req, res, next) => {
  const { studentId, groupId } = req.body;
  const enrollmentManager = new EnrollmentServices();

  try {
    const theEnrollment = await enrollmentManager.getByStudentAndGroup(studentId, groupId);

    return res.status(200).json({
      success: true,
      message: 'Matrícula encontrada exitosamente',
      enrollment: theEnrollment,
      authentication: res.locals.newUserToken,
    });
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible encontrar la matrícula para el estudiante y grupo indicados',
    });
    next(boomError);
  }
};
