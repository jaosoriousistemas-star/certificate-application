import { ScoreServices } from '../../services/scoreServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to update an existing score.
 *
 * Extracts the score id and the fields to update from the request body,
 * delegates the update to ScoreServices, and responds according to the outcome.
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.id
 * @param {string} [req.body.originalScore]
 * @param {string} [req.body.scoreType]
 * @param {string} [req.body.subjectId]
 * @param {string} [req.body.remedialScore]
 * @param {string} [req.body.enrollmentId]
 * @param {Object} res
 * @param {string} res.locals.newUserToken
 * @param {Function} next
 * @returns {Promise<void>}
 */
export const updateOneScore = async (req, res, next) => {
  const { id } = req.body;
  const newScoreData = {
    originalScore: req.body.originalScore,
    scoreType: req.body.scoreType,
    subjectId: req.body.subjectId,
    remedialScore: req.body.remedialScore,
    enrollmentId: req.body.enrollmentId,
  };

  const scoreManager = new ScoreServices();

  try {
    const response = await scoreManager.updateOne(id, newScoreData);

    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'Calificación actualizada exitosamente',
        authentication: res.locals.newUserToken,
      });
    }
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible actualizar la calificación en la base de datos',
    });
    next(boomError);
  }
};
