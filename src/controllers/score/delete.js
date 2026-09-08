import { ScoreServices } from '../../services/scoreServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to delete an existing score.
 *
 * Extracts the score id from the request body, delegates the deletion to
 * ScoreServices (no associated records guard required), and responds
 * according to the outcome.
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
export const deleteOneScore = async (req, res, next) => {
  const { id } = req.body;
  const scoreManager = new ScoreServices();

  try {
    const response = await scoreManager.deleteOne(id);

    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'Calificación eliminada exitosamente',
        authentication: res.locals.newUserToken,
      });
    }
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible eliminar la calificación de la base de datos',
    });
    next(boomError);
  }
};
