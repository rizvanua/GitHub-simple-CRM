import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

export interface IUser {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserCreate {
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export class UserModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Create a new user
  async create(userData: IUserCreate): Promise<IUser> {
    const { email, password } = userData;
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, password_hash, created_at, updated_at
    `;

    const result = await this.pool.query(query, [email, passwordHash]);
    return result.rows[0];
  }

  // Find user by email
  async findByEmail(email: string): Promise<IUser | null> {
    const query = `
      SELECT id, email, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  // Find user by ID
  async findById(id: number): Promise<IUser | null> {
    const query = `
      SELECT id, email, password_hash, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Check if user exists by email
  async existsByEmail(email: string): Promise<boolean> {
    const query = `
      SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)
    `;

    const result = await this.pool.query(query, [email]);
    return result.rows[0].exists;
  }

  // Compare password
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Update user
  async update(id: number, updates: Partial<IUserCreate>): Promise<IUser | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.email) {
      fields.push(`email = $${paramCount}`);
      values.push(updates.email);
      paramCount++;
    }

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(updates.password, salt);
      fields.push(`password_hash = $${paramCount}`);
      values.push(passwordHash);
      paramCount++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, email, password_hash, created_at, updated_at
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete user
  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM users
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }
}
