"use strict";

import koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import bodyparser from "@koa/bodyparser";
import promisePool from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// JWT 配置
const JWT_SECRET = "your_jwt_secret"; // 替换为安全的密钥
const JWT_EXPIRES_IN = "1h"; // JWT 有效期为1小时

const app = new koa();
const router = new Router();

// 使用 cors 中间件
app.use(cors()).use(bodyparser());

router.get("/", (ctx) => {
  ctx.body = "Hello World!";
});

router.post("/register", async (ctx) => {
  const { username, password } = ctx.request.body;
  if (!username) {
    return (ctx.body = {
      code: 1,
      msg: "用户名不能为空",
    });
  }
  if (!password) {
    return (ctx.body = {
      code: 1,
      msg: "密码不能为空",
    });
  }
  try {
    // 检查用户名是否已存在
    const [existingUser] = await promisePool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return (ctx.body = {
        code: 1,
        msg: "用户名已存在",
      });
    }
    // 哈希用户密码
    const passwordHash = await bcrypt.hash(password, 10);
    // 将新用户插入到数据库
    await promisePool.query(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [username, passwordHash]
    );
    return (ctx.body = {
      code: 200,
      msg: "注册成功",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (ctx) => {
  const { username, password } = ctx.request.body;
  if (!username) {
    return (ctx.body = {
      code: 1,
      msg: "用户名不能为空",
    });
  }
  if (!password) {
    return (ctx.body = {
      code: 1,
      msg: "密码不能为空",
    });
  }

  try {
    // 查找用户
    const [users] = await promisePool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return (ctx.body = {
        code: 1,
        msg: "用户不存在",
      });
    }
    const user = users[0];
    console.log(users);
    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return (ctx.body = {
        code: 1,
        msg: "密码错误",
      });
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    ctx.body = {
      message: "登陆成功",
      token,
    };
  } catch (error) {
    console.log(error);
  }
});

router.post("/getInfo", async (ctx) => {
  console.log(ctx.headers);
  const { authorization } = ctx.headers;
  if (!authorization) {
    return (ctx.body = {
      code: 400,
      msg: "未登录",
    });
  }

  try {
    // 验证 JWT
    const decoded = jwt.verify(authorization, JWT_SECRET);
    console.log(decoded);
    const [users] = await promisePool.query(
      "SELECT * FROM users WHERE id = ?",
      [decoded.id]
    );
    if (users.length === 0) {
      return (ctx.body = {
        code: 400,
        msg: "用户不存在",
      });
    }
    return (ctx.body = {
      code: 200,
      data: {
        id: decoded.id,
        username: decoded.username,
        name: "John Doe",
        age: 25,
      },
    });
  } catch (err) {
    ctx.status = 401;
    ctx.body = { message: "token失效" };
  }
});

router.delete("/delete_user/:userId", async (ctx) => {
  console.log(ctx.params);
  const { userId } = ctx.params;
  if (!userId) {
    return (ctx.body = {
      code: 1,
      msg: "userId不能为空",
    });
  }
  try {
    // 判断id是否存在
    const [users] = await promisePool.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    if (users.length === 0) {
      return (ctx.body = {
        code: 1,
        msg: "用户不存在",
      });
    }
    await promisePool.query("DELETE FROM users WHERE id = ?", [userId]);
    return (ctx.body = {
      code: 200,
      msg: "删除成功",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get_user_list", async (ctx) => {
  const { page, size, id, username } = ctx.query;
  // 确保分页参数是有效的数字
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(size, 10);
  // 计算偏移量
  const offset = (pageNumber - 1) * pageSize;
  // 构建 SQL 查询条件
  let query = "SELECT id, username, createTime FROM users WHERE 1=1"; // 初始条件
  let countQuery = "SELECT COUNT(*) as count FROM users WHERE 1=1"; // 计算总记录数的查询
  const params = []; // 查询参数
  // 添加筛选条件
  if (id) {
    query += " AND id = ?";
    countQuery += " AND id = ?";
    params.push(id);
  }
  if (username) {
    query += " AND username LIKE ?";
    countQuery += " AND username LIKE ?";
    params.push(`%${username}%`);
  }
  // 添加分页条件
  query += " LIMIT ? OFFSET ?";
  params.push(pageSize, offset);
  try {
    // 查询总记录数
    const [[{ count }]] = await promisePool.query(countQuery, params);
    // 查询用户列表
    const [users] = await promisePool.query(query, params);

    console.log(users);    
    return (ctx.body = {
      code: 200,
      data: {
        total: count,
        page: pageNumber,
        size: pageSize,
        list: users,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(9000, () => {
  console.log("Server is running on http://localhost:9000");
});
