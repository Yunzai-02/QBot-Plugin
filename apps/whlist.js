import { Config } from '#components'
import { QBot, Login, Buttons } from '#model'

export class QWHList extends plugin {
  constructor() {
    super({
      name: '[notice.js]QBotWH订阅',
      dsc: 'QQ开放平台',
      event: 'message',
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}订阅$`,
          fnc: 'whlist'
        }
      ]
    })
  }
  async whlist(e) {
    const login = await Login.Login(e)
    return this.data(e, login.ck, login.appId)
  }

  async data(e, ck, appId) {
    const data = await QBot.getwhlist(ck.uin, ck.developerId, ck.ticket, appId)
    const whlist = data.data.events
    const groupedEvents = whlist.reduce((acc, event) => {
      const type = event.type
      if (!acc[type]) acc[type] = []
      acc[type].push(event)
      return acc
    }, {})

    const msg = [`${QBot.title(true)}QBot订阅`, `${QBot.json()}`]

    for (const [type, events] of Object.entries(groupedEvents)) {
      msg.push(`${QBot.title()}${type}`)
      events.forEach(event => {
        msg.push(`${QBot.quote()}【${event.id}】 ${event.name}（${event.is_subscribed ? '已订阅' : '未订阅'}）`)
      })
      msg.push('\r\r---\r')
    }

    msg.push(`${QBot.json()}`)
    return await e.reply([msg.join(''), new Buttons().QBot()])
  }
}
