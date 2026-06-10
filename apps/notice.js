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

		const q = QBot.quote()
		const notices = notice.map((msgs, index) => {
			const time = moment(parseInt(msgs.send_time) * 1000).format('M月D日 HH:mm')
			const title = msgs.title.replace(/<[^>]*>?/gm, '')
			return [`${q}📬 通知 ${index + 1}`, `${q}标题：${title}`, `${q}时间：${time}`].join('')
		})

		const msg = [
			`${QBot.title(true)}📬 QBot通知`,
			`${QBot.quote(true)}共 ${QBot.bold(notice.length + ' 条通知')}`,
			`${QBot.json()}`,
			notices.join('\r\r---\r'),
			`${QBot.json()}`
		]
		return await e.reply([msg.join(''), new Buttons().QBot()])
	}
}
