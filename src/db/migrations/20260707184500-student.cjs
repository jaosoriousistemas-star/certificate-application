'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  // ============================================================
  // UP — Create the 'estudiante' table
  // ============================================================
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('estudiante', {

      // Primary key
      id_estudiante: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },

      // Student first name
      primer_nombre_estudiante: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      // Student second name
      segundo_nombre_estudiante: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      // Student first last name
      primer_apellido_estudiante: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      // Student second last name
      segundo_apellido_estudiante: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      // Document number (nullable, since historical students may lack a registered ID)
      identificacion_estudiante: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      // Birth date
      fecha_nacimiento_estudiante: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      // Foreign key to municipio — RESTRICT on delete
      id_municipio_estudiante: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'municipio',
          key: 'id_municipio',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      // Foreign key to tipo_documento (optional) — SET NULL on delete
      id_tipo_documento_estudiante: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'tipo_documento',
          key: 'id_tipo_documento',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      // Foreign key to genero (optional) — SET NULL on delete
      id_genero_estudiante: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'genero',
          key: 'id_genero',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      // Home address
      direccion_estudiante: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },

      // Email
      email_estudiante: {
        type: Sequelize.STRING(254),
        allowNull: true,
        unique: true,
      },

      // Creation timestamp
      fecha_creacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      // Update timestamp
      fecha_modificacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

    });

    // Composite unique constraint to identify a student when no document
    // number is available (first/last names + birth date)
    await queryInterface.addIndex('estudiante', {
      unique: true,
      fields: [
        'primer_nombre_estudiante',
        'segundo_nombre_estudiante',
        'primer_apellido_estudiante',
        'segundo_apellido_estudiante',
        'fecha_nacimiento_estudiante',
      ],
      name: 'estudiante_nombre_apellidos_fecha_nacimiento_unique',
    });
  },

  // ============================================================
  // DOWN — Drop the 'estudiante' table
  // ============================================================
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('estudiante');
  },

};
