import { Config } from '#components'
import { DB, QBot, Buttons } from '#model'

export class Qcount extends plugin {
	constructor() {
		super({
			name: '[count.js]QBotcount',
			dsc: 'QQ开放平台',
			event: 'message',
			priority: Config.admin.priority,
			rule: [
				{
					reg: `^#?${Config.admin.reg}(用户|群聊)?统计$`,
					fnc: 'all'
				}
			]
		})
	}

	async accept(e) {
		if (!Config.QBotSet.count || !QBot.isQQBot(e)) return false
		if (!(await DB.getUser(e.user_id, e.bot.uin))) {
			await DB.addUser(e.user_id, e.bot.uin, e.user_id)
			const userCount = await DB.getUserCount(e.bot.uin)
			let avatarUrl = await Bot.pickMember(e.group_id, e.user_id).getAvatarUrl(100)
			if (!e.isGroup) avatarUrl = await Bot.pickFriend(e.user_id).getAvatarUrl(100)
			const url = await avatarUrl.replace(/\/0$/, '/100')
			const msg = [
				QBot.quote(true),
				segment.image(url),
				`${QBot.quote(true)}👋 欢迎`,
				segment.at(e.user_id),
				`！您是第${userCount}位使用${e.bot.nickname}的用户！`,
				`${QBot.quote(true)}可以把${e.bot.nickname}邀请到任意群使用哦！`
			]
			await e.reply(msg)
		}
		if (e.isGroup && e.group_id && !(await DB.getGroup(e.group_id, e.bot.uin)))
			await DB.addGroup(e.group_id, e.bot.uin, e.group_id)
		return false
	}

	async all(e) {
		const userCount = await DB.getUserCount(e.bot.uin)
		const groupCount = await DB.getGroupCount(e.bot.uin)
		const isMd = Config.QBotSet.markdown === 1
		const msg = [
			`${QBot.title(true)}📊 ${e.bot.nickname}统计`,
			isMd ? '' : QBot.quote(true),
			isMd
				? `\r> 👤 用户：${QBot.bold(String(userCount))}\r> 👥 群组：${QBot.bold(String(groupCount))}`
				: `\r👤 用户：${userCount}\r👥 群组：${groupCount}`
		]
		await e.reply([...msg, new Buttons().QBot()])
	}
}
