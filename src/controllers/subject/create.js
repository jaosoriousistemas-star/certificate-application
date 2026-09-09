import { SubjectServices } from '../../services/subjectServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to create a new subject.
 *
 * Extracts the new subject data from the request body, delegates the creation
 * to SubjectServices, and responds according to the outcome.
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see subjectSchema.newSubjectData).
 * @param {string} req.body.name - The subject name.
 * @param {string} req.body.description - The subject description.
 * @param {string} req.body.hourlyIntensity - The weekly hourly intensity (1-9).
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the operation result and the rotated token.
 */
export const createOneSubject = async (req, res, next) => {
  const newSubject = {
    name: req.body.name,
    description: req.body.description,
    hourlyIntensity: req.body.hourlyIntensity,
  };

  const subjectManager = new SubjectServices();

  try {
    const response = await subjectManager.createOne(newSubject);

    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Asignatura creada exitosamente',
        authentication: res.locals.newUserToken,
      });
    }
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible crear la asignatura en la base de datos',
    });
    next(boomError);
  }
};
