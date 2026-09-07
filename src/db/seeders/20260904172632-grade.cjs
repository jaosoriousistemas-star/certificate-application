'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Inserts all academic grades using INSERT IGNORE.
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT IGNORE INTO grado (nombre_grado, descripcion_grado) VALUES
        ('Primero', 'Primer grado de educación básica primaria'),
        ('Segundo', 'Segundo grado de educación básica primaria'),
        ('Tercero', 'Tercer grado de educación básica primaria'),
        ('Cuarto', 'Cuarto grado de educación básica primaria'),
        ('Quinto', 'Quinto grado de educación básica primaria'),
        ('Sexto', 'Sexto grado de educación básica secundaria'),
        ('Séptimo', 'Séptimo grado de educación básica secundaria'),
        ('Octavo', 'Octavo grado de educación básica secundaria'),
        ('Noveno', 'Noveno grado de educación básica secundaria'),
        ('Décimo', 'Décimo grado de educación media'),
        ('Undécimo', 'Undécimo grado de educación media')
    `);
  },

  /**
   * Removes all inserted grades.
   */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('grado', {
      nombre_grado: [
        'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto',
        'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Undécimo'
      ]
    });
  }
};
