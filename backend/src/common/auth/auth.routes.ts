import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// 登录
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // TODO: 从数据库查询用户
    // 这里是示例代码
    if (username === 'teacher' && password === 'password123') {
      const user = {
        id: '1',
        username: 'teacher',
        email: 'teacher@school.com',
        role: 'teacher',
        school: '示范高中',
        grade: '高一',
      };

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          user,
          token,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
  })
);

// 注册
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, school } = req.body;

    // TODO: 验证用户是否已存在
    // TODO: 哈希密码并保存到数据库
    // 这里是示例代码

    const hashedPassword = await bcrypt.hash(password, 10);

    res.json({
      success: true,
      message: 'User registered successfully',
    });
  })
);

// 刷新token
router.post(
  '/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    // TODO: 验证并刷新token
    res.json({
      success: true,
      data: {
        token: 'new-token',
      },
    });
  })
);

export default router;
