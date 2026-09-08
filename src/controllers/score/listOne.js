import { ScoreServices } from '../../services/scoreServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single score by its id.
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
export const listOneScore = async (req, res, next) => {
  const { id } = req.body;
  const scoreManager = new ScoreServices();

  try {
    const theScore = await scoreManager.listOne(id);

    return res.status(200).json({
      success: true,
      message: 'Calificación encontrada exitosamente',
      score: theScore,
      authentication: res.locals.newUserToken,
    });
  } catch (error) {
    const boomError = Boom.boomify(error, {
      message: 'No es posible consultar la calificación en la base de datos',
    });
    next(boomError);
  }
};
