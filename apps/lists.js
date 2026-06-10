import { Config } from '#components'
import { QBot, Login, Buttons } from '#model'

export class Qlists extends plugin {
	constructor() {
		super({
			name: '[lists.js]QBot列表',
			dsc: 'QQ开放平台',
			event: 'message',
			priority: Config.admin.priority,
			rule: [
				{
					reg: `^#?${Config.admin.reg}列表$`,
					fnc: 'lists'
				}
			]
		})
	}
	async lists(e) {
		const login = await Login.Login(e)
		return this.data(e, login.ck)
	}

	async data(e, ck) {
		const data = await QBot.getlists(ck.uin, ck.developerId, ck.ticket)
		const apps = data.data.apps

		const statusMap = {
			0: '❓ 未知',
			1: '🔧 开发中',
			2: '🔍 审核中',
			3: '✅ 审核通过',
			4: '❌ 审核不通过',
			5: '🚀 发布中',
			6: '✅ 已发布',
			7: '🚫 封禁中'
		}

		const q = QBot.quote()
		const lists = apps.map((app) => {
			const statusText = statusMap[app.bot_status] || `❓ 未知(${app.bot_status})`
			return [
				`${q}🤖 ${app.app_name}`,
				`${q}ID: ${app.app_id}  ${statusText}`,
				`${q}${app.app_desc || '暂无描述'}`
			].join('')
		})

		const msg = [
			`${QBot.title(true)}📋 QBot账号列表`,
			`${QBot.quote(true)}共 ${QBot.bold(apps.length + ' 个应用')}`,
			`${QBot.json()}`,
			lists.join('\r\r---\r'),
			`${QBot.json()}`
		]
		return await e.reply([msg.join(''), new Buttons().QBot()])
	}
}
