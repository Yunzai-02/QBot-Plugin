import { Config } from '#components'
import { QBot, Login, Buttons } from '#model'
import moment from 'moment'

export class Qnotice extends plugin {
  constructor() {
    super({
      name: '[notice.js]QBot通知',
      dsc: 'QQ开放平台',
      event: 'message',
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}通知$`,
          fnc: 'notice'
        }
      ]
    })
  }

  async notice(e) {
    const login = await Login.Login(e)
    return this.data(e, login.ck)
  }

  async data(e, ck) {
    const data = await QBot.getnotice(ck.uin, ck.developerId, ck.ticket)
    const notice = data.data.privateMsgs
    if (notice.length === 0) {
      return await e.reply('暂无通知消息。')
    }
    const notices = notice.map((msgs, index) => {
      const msg = [
        `${QBot.title()}通知: ${index + 1}`,
        `${QBot.quote()}标题: ${msgs.title.replace(/<[^>]*>?/gm, '')}`,
        `${QBot.quote()}时间: ${moment(parseInt(msgs.send_time) * 1000).format('YYYY年MM月DD日HH:mm')}`
      ]
      return msg.join('')
    })

    let msglist = [`${QBot.title(true)}QBot通知\r`, `${QBot.json()}`, notices.join('\r\r---\r'), `${QBot.json()}`]

    return await e.reply([msglist.join(''), new Buttons().QBot()])
  }
}
