// Import the sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';
// Define the name of the students table
export const STUDENT_TABLE = 'estudiante';
// Define the Student model
export const Student = sequelize.define(STUDENT_TABLE, {
  // Define the 'id' column
  id: {
    // Integer type
    type: DataTypes.INTEGER,
    // This field cannot be null
    allowNull: false,
    // Primary key
    primaryKey: true,
    // Must be unique
    unique: true,
    // Auto increment value
    autoIncrement: true,
    // Database column name
    field: 'id_estudiante',
  },
  // Student first name
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'primer_nombre_estudiante',
  },
  // Student second name
  middleName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'segundo_nombre_estudiante',
  },
  // Student first last name
  firstLastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'primer_apellido_estudiante',
  },
  // Student second last name
  secondLastName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'segundo_apellido_estudiante',
  },
  // Document number (nullable, since historical students may lack a registered ID)
  documentNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'identificacion_estudiante',
  },
  // Birth date
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'fecha_nacimiento_estudiante',
  },
  // Foreign key to Municipality
  municipalityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_municipio_estudiante',
    references: {
      model: 'municipio',
      key: 'id_municipio',
    },
  },
  // Foreign key to Document Type
  documentTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_tipo_documento_estudiante',
    references: {
      model: 'tipo_documento',
      key: 'id_tipo_documento',
    },
  },
  // Foreign key to Gender
  genderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_genero_estudiante',
    references: {
      model: 'genero',
      key: 'id_genero',
    },
  },
  // Home address
  address: {
    type: DataTypes.STRING(120),
    allowNull: true,
    field: 'direccion_estudiante',
  },
  // Email
  email: {
    type: DataTypes.STRING(254),
    allowNull: true,
    unique: true,
    field: 'email_estudiante',
    validate: {
      isEmail: true,
    },
  },
  // Creation date
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion',
  },
  // Last update date
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_modificacion',
  },
}, {
  // Pass the sequelize instance
  sequelize,
  // Specify the table name
  tableName: STUDENT_TABLE,
  // Specify the model name
  modelName: 'student',
  // Enable automatic timestamps
  timestamps: true,
  // Composite unique constraint to identify a student when no document number is available
  indexes: [
    {
      unique: true,
      fields: [
        'primer_nombre_estudiante',
        'segundo_nombre_estudiante',
        'primer_apellido_estudiante',
        'segundo_apellido_estudiante',
        'fecha_nacimiento_estudiante',
      ],
    },
  ],
});
