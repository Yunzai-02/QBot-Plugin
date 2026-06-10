import { Config } from '#components'
import { QBot, Login, Buttons } from '#model'

export class Qmsg_tpl extends plugin {
	constructor() {
		super({
			name: '[msg_tpl.js]QBot模板',
			dsc: 'QQ开放平台',
			event: 'message',
			priority: Config.admin.priority,
			rule: [
				{
					reg: `^#?${Config.admin.reg}(消息)?模板(列表)?$`,
					fnc: 'msg_tpl'
				}
			]
		})
	}
	async msg_tpl(e) {
		const login = await Login.Login(e)
		return this.data(e, login.ck, login.appId)
	}

	async data(e, ck, appId) {
		const data = await QBot.getmsg_tpl(ck.uin, ck.developerId, ck.ticket, appId)
		const msg_tpl = data.data.list
		if (msg_tpl.length === 0) {
			return await e.reply(['暂无模板消息。', new Buttons().QBot()])
		}

		const typeMap = {
			1: '🔘 按钮组件',
			2: '📝 Markdown组件'
		}
		const statusMap = {
			1: '⏳ 未提审',
			2: '🔍 审核中',
			3: '✅ 已通过',
			4: '❌ 未通过'
		}

		const q = QBot.quote()
		const templates = msg_tpl.map((tpl) => {
			const typeText = typeMap[tpl.tpl_type] || `❓ 未知(${tpl.tpl_type})`
			const statusText = statusMap[tpl.status] || `❓ 未知(${tpl.status})`
			return [
				`${q}📄 ${tpl.tpl_name}`,
				`${q}ID: ${tpl.tpl_id}`,
				`${q}类型: ${typeText}`,
				`${q}状态: ${statusText}`
			].join('')
		})

		const msg = [
			`${QBot.title(true)}📝 QBot消息模板`,
			`${QBot.quote(true)}${QBot.bold(msg_tpl.length + '/' + data.data.max_msg_tpl_count + ' 个模板')}`,
			`${QBot.json()}`,
			templates.join('\r\r---\r'),
			`${QBot.json()}`
		]
		return await e.reply([msg.join(''), new Buttons().QBot()])
	}
}
