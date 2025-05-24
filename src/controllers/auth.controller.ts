import bcrypt from 'bcrypt';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  await user.save();
  res.status(201).json({ message: 'User registered' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password,user))) {
     res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user?._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'User Login',token:token });

};


const comparePassword = async function (candidate: string,user:any):Promise<boolean> {
  return await bcrypt.compare(candidate, user.password);
};