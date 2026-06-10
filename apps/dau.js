import { Config } from '#components'
import { QBot, Login, Buttons } from '#model'
import moment from 'moment'

export class Qdau extends plugin {
	constructor() {
		super({
			name: '[dau.js]QBotdau',
			dsc: 'QQ开放平台',
			event: 'message',
			priority: Config.admin.priority,
			rule: [
				{
					reg: `^#?${Config.admin.reg}数据(\\d+)?$`,
					fnc: 'dau'
				}
			]
		})
	}

	async dau(e) {
		const login = await Login.Login(e)
		let days = Config.QBotSet.day
		const match = e.msg.match(new RegExp(`^#?${Config.admin.reg}数据(\\d+)?$`))
		if (match && match[2]) days = parseInt(match[2])
		return this.data(e, login.ck, login.appId, days)
	}

	async data(e, ck, appId, days) {
		const [data0, data1, data2, data3] = await Promise.all([
			QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 0),
			QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 1),
			QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 2),
			QBot.getdau(ck.uin, ck.developerId, ck.ticket, appId, 3)
		])

		let qg_data = data0.data.guild_data
		let msg_data = data1.data.msg_data
		let group_data = data2.data.group_data
		let friend_data = data3.data.friend_data

		const Days = msg_data.length
		const UpUv = msg_data.reduce((sum, dayData) => sum + (dayData?.up_msg_uv || 0), 0)
		const avgUpUv = Days > 0 ? (UpUv / Days).toFixed(2) : 0

		const q = QBot.quote()
		let msglist = []
		for (let i = 0; i < days; i++) {
			const DAUdata = msg_data[i]?.report_date ? moment(msg_data[i].report_date, 'YYYYMMDD').format('M月D日') : '-'
			const m = msg_data[i]
			const g = group_data[i]
			const f = friend_data[i]
			const qd = qg_data[i]
			const dayInfo = [
				`${q}📅 ${DAUdata}`,
				`${q}💬 消息  上行:${m?.up_msg_cnt ?? '-'}  下行:${m?.down_msg_cnt ?? '-'}  总:${m?.bot_msg_cnt ?? '-'}  人数:${m?.up_msg_uv ?? '-'}`,
				`${q}👥 群聊  现有:${g?.existing_groups ?? '-'}  已用:${g?.used_groups ?? '-'}  新增:${g?.added_groups ?? '-'}  退:${g?.removed_groups ?? '-'}`,
				`${q}🤝 好友  现有:${f?.stock_added_friends ?? '-'}  已用:${f?.used_friends ?? '-'}  新增:${f?.new_added_friends ?? '-'}  删:${f?.new_removed_friends ?? '-'}`,
				`${q}🏠 频道  现有:${qd?.in_guild_cnt ?? '-'}  已用:${qd?.used_guild_cnt ?? '-'}  新增:${qd?.add_guild_cnt ?? '-'}  退:${qd?.removed_guild_cnt ?? '-'}`
			]
			msglist.push(dayInfo.join(''))
		}

		const msg = [
			`${QBot.title(true)}📊 QBot数据统计`,
			`${QBot.quote(true)}📅 ${QBot.bold('最近' + days + '天数据概览')}`,
			`${QBot.json()}`,
			msglist.join('\r\r---\r'),
			`${QBot.json()}`,
			`${QBot.quote(true)}📈 近${Days}天平均活跃：${QBot.bold(avgUpUv + ' 人')}`
		]
		e.reply([msg.join(''), new Buttons().QBot()])
	}
}
