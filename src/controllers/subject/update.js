import { SubjectServices } from '../../services/subjectServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to update an existing subject.
 *
 * Extracts the subject id and the fields to update from the request body,
 * delegates the update to SubjectServices, and responds according to the outcome.
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see subjectSchema.updateSubjectData).
 * @param {string} req.body.id - The id of the subject to update.
 * @param {string} [req.body.name] - The new subject name.
 * @param {string} [req.body.description] - The new subject description.
 * @param {string} [req.body.hourlyIntensity] - The new weekly hourly intensity.
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the operation result and the rotated token.
 */
export const updateOneSubject = async (req, res, next) => {
  const { id } = req.body;
  const newSubjectData = {
    name: req.body.name,
    description: req.body.description,
    hourlyIntensity: req.body.hourlyIntensity,
  };

  const subjectManager = new SubjectServices();

  try {
    const response = await subjectManager.updateOne(id, newSubjectData);

    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'Asignatura actualizada exitosamente',
        authentication: res.locals.newUserToken,
      });
    }
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible actualizar la asignatura en la base de datos',
    });
    next(boomError);
  }
};
