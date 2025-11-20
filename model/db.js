import fs from "fs"
import path from "path"
import sqlite3 from "sqlite3"

const dbPath = "./data/QBot/data.db"
fs.mkdirSync(path.dirname(dbPath), { recursive: true })
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  // 用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      UserId TEXT NOT NULL,
      bot_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (bot_id, UserId)
    )
  `)

  // 群组表
  db.run(`
    CREATE TABLE IF NOT EXISTS groups (
      GroupId TEXT NOT NULL,
      bot_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (bot_id, GroupId)
    )
  `)

  // Cookies表
  db.run(`
    CREATE TABLE IF NOT EXISTS cookies (
      user_id INTEGER NOT NULL,
      appId TEXT NOT NULL,
      uid TEXT NOT NULL,
      uin TEXT NOT NULL,
      ticket TEXT NOT NULL,
      developerId TEXT NOT NULL,
      appType TEXT NOT NULL,
      PRIMARY KEY (user_id, appId)
    )
  `)

  // 创建索引
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_bot ON users(bot_id)`)
  db.run(`CREATE INDEX IF NOT EXISTS idx_groups_bot ON groups(bot_id)`)
})

export default new (class DB {
  // ===== 用户相关方法 =====
  async addUser(UserId, BotId) {
    return this.run(`INSERT OR IGNORE INTO users (UserId, bot_id) VALUES (?, ?)`, [UserId, BotId])
  }

  async getUser(UserId, BotId) {
    return this.get(`SELECT * FROM users WHERE UserId = ? AND bot_id = ?`, [UserId, BotId])
  }

  async getUserCount(BotId) {
    const result = await this.get(`SELECT COUNT(*) as count FROM users WHERE bot_id = ?`, [BotId])
    return result?.count || 0
  }

  async getAllUsers(BotId = null) {
    const query = BotId ? `SELECT UserId FROM users WHERE bot_id = ?` : `SELECT DISTINCT UserId FROM users`
    const params = BotId ? [BotId] : []

    const rows = await this.all(query, params)
    return rows.map((row) => row.UserId)
  }

  // ===== 群组相关方法 =====
  async addGroup(GroupId, BotId) {
    return this.run(`INSERT OR IGNORE INTO groups (GroupId, bot_id) VALUES (?, ?)`, [GroupId, BotId])
  }

  async getGroup(GroupId, BotId) {
    return this.get(`SELECT * FROM groups WHERE GroupId = ? AND bot_id = ?`, [GroupId, BotId])
  }

  async getGroupCount(BotId) {
    const result = await this.get(`SELECT COUNT(*) as count FROM groups WHERE bot_id = ?`, [BotId])
    return result?.count || 0
  }

  async getAllGroups(BotId = null) {
    const query = BotId ? `SELECT GroupId FROM groups WHERE bot_id = ?` : `SELECT DISTINCT GroupId FROM groups`
    const params = BotId ? [BotId] : []

    const rows = await this.all(query, params)
    return rows.map((row) => row.GroupId)
  }

  // ===== Cookies方法 =====
  async setCookies(...params) {
    return this.run(
      `INSERT OR REPLACE INTO cookies 
       (user_id, appId, uid, uin, ticket, developerId, appType)
       VALUES (?,?,?,?,?,?,?)`,
      params
    )
  }

  async getCookies(user, appid) {
    return this.get(
      `SELECT uid, uin, ticket, developerId, appType, appId 
       FROM cookies WHERE user_id=? AND appId=?`,
      [user, appid]
    )
  }

  // ===== 数据库基础方法 =====
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        err ? reject(err) : resolve(this)
      })
    })
  }

  get(sql, params = []) {
    return new Promise((resolve) => {
      db.get(sql, params, (err, row) => resolve(err ? null : row))
    })
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        err ? reject(err) : resolve(rows || [])
      })
    })
  }
})()
