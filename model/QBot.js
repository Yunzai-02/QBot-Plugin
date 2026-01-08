import { Config } from '#components'

export default new (class QBot {
  constructor() {
    this.api = 'https://q.qq.com'
    this.bot = `https://bot.q.qq.com`
    this.login = `${this.api}/qrcode/create`
    this.qr = `${this.api}/qrcode/get`
    this.info = `${this.api}/pb/GetDeveloper`
    this.notice = `${this.api}/pb/AppFetchPrivateMsg`
    this.lists = `${this.api}/homepagepb/GetAppListForLogin`
    this.dau = `${this.bot}/cgi-bin/datareport/read`
    this.msg_tpl = `${this.bot}/cgi-bin/msg_tpl/list`
    this.status = `${this.api}/pb/GetDeveloper`
    this.whlist = `${this.bot}/cgi-bin/event_subscirption/list_event`
    this.upip = `${this.bot}/cgi-bin/dev_info/update_white_ip_config`
  }

  async getlogin(type, appId = null, uin, uid, ticket) {
    const json = await fetch(this.login, {
      method: 'POST',
      headers: this.getHeaders(uin, uid, ticket),
      body: JSON.stringify({ type: type, miniAppId: appId })
    })
    const data = await json.json()
    const QrCode = data.data.QrCode
    return QrCode
  }

  async getqrcode(qrcode) {
    const json = await fetch(this.qr, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ qrcode: qrcode })
    })
    const data = await json.json()
    return data
  }

  async getinfo(uin, uid, ticket) {
    const json = await fetch(this.info, {
      method: 'GET',
      headers: this.getHeaders(uin, uid, ticket)
    })
    const data = await json.json()
    return data
  }

  async getnotice(uin, uid, ticket) {
    const json = await fetch(this.notice, {
      method: 'POST',
      headers: this.getHeaders(uin, uid, ticket),
      body: JSON.stringify({ page_num: 0, page_size: 10, receiver: uid, appType: 2 })
    })
    const data = await json.json()
    return data
  }

  async getlists(uin, uid, ticket) {
    const json = await fetch(this.lists, {
      method: 'POST',
      headers: this.getHeaders(uin, uid, ticket),
      body: JSON.stringify({ uin: uin, developer_id: uid, ticket: ticket, app_type: [2] })
    })
    const data = await json.json()
    return data
  }

  async getdau(uin, uid, ticket, appid, type) {
    const json = await fetch(`${this.dau}?bot_appid=${appid}&data_type=${type}&data_range=2&scene_id=1`, {
      method: 'GET',
      headers: this.getHeaders(uin, uid, ticket)
    })
    const data = await json.json()
    return data
  }

  async getmsg_tpl(uin, uid, ticket, appid) {
    const json = await fetch(this.msg_tpl, {
      method: 'POST',
      headers: this.getHeaders(uin, uid, ticket),
      body: JSON.stringify({ bot_appid: appid, limit: 30 })
    })
    const data = await json.json()
    return data
  }

  async getstatus(uin, uid, ticket) {
    const json = await fetch(this.status, {
      method: 'GET',
      headers: this.getHeaders(uin, uid, ticket)
    })
    const data = await json.json()
    return data
  }

  async getwhlist(uin, uid, ticket, appid) {
    const json = await fetch(this.whlist, {
      method: 'POST',
      headers: this.getHeaders(uin, uid, ticket),
      body: JSON.stringify({ bot_appid: appid })
    })
    const data = await json.json()
    return data
  }

  async updateip(uin, uid, ticket, appid, ip, qrocde) {
    const json = await fetch(this.upip, {
      method: 'POST',
      headers: this.getHeaders(uin, uid, ticket),
      body: JSON.stringify({
        bot_appid: appid,
        ip_white_infos: { prod: { ip_list: [ip], use: true } },
        qr_code: qrocde
      })
    })
    const data = await json.json()
    return data
  }

  getHeaders(uin = null, uid = null, ticket = null) {
    const headers = {
      'User-Agent': 'request',
      'Content-Type': 'application/json',
      Cookie: `quin=${uin};quid=${uid};qticket=${ticket}`
    }
    return headers
  }

  title(md = false) {
    return !Config.QBotSet.markdown ? '\r' : md || Config.QBotSet.markdown === 1 ? '\r###' : '\r'
  }

  quote(md = false) {
    return !Config.QBotSet.markdown ? '\r' : md || Config.QBotSet.markdown === 1 ? '\r> ' : '\r'
  }

  json() {
    return Config.QBotSet.markdown === 2 ? '\r```\r' : '\r'
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  isQQBot(e) {
    return (e.bot?.adapter?.name || e.platform || '未知') === 'QQBot'
  }
})()
