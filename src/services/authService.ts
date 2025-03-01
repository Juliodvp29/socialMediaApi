import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default {
  async register(userData: any) {
    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    // Crear el usuario
    const user = await User.create(userData);
    if (user.password) {
      delete user.password; // No devolver la contraseña
    }
    
    return user;
  },

  async login(email: string, password: string) {
    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas');
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    delete user.password; // No devolver la contraseña
    
    return { user, token };
  }
};