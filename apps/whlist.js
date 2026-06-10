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

		const q = QBot.quote()
		const sections = []
		for (const [type, events] of Object.entries(groupedEvents)) {
			const items = events.map((event) => {
				const status = event.is_subscribed ? '✅' : '⬜'
				return `${q}${status} [${event.id}] ${event.name}`
			})
			sections.push(`${q}📂 ${type}${items.join('')}`)
		}

		const msg = [`${QBot.title(true)}📡 QBot事件订阅`, `${QBot.json()}`, sections.join('\r\r---\r'), `${QBot.json()}`]
		return await e.reply([msg.join(''), new Buttons().QBot()])
	}
}
