import renderHelp from 'help-html'
import { Config, common, Plugin_Path, Plugin_Name, Version } from '#components'
import { Buttons } from '#model'

const HELP_CONFIG = {
	title: 'QBot帮助',
	columns: 2,
	theme: {
		menu: '[QBot插件] Yunzai-Bot&QBot-Plugin',
		mode: 'light',
		bgImage: `${Plugin_Path}/resources/help/theme/default/main.jpg`,
		font: `${Plugin_Path}/resources/font/font.woff`,
		bgColor: '#fdf7f9',
		color: '#3f2e36',
		desc: '#705b64',
		accent: '#d94f70',
		muted: '#765f69',
		panel: 'rgba(255, 255, 255, .78)',
		blur: 6,
		panelBorder: 'rgba(255, 255, 255, .88)',
		panelShadow: '0 18px 45px -20px rgba(126, 55, 78, .28)',
		headBg: 'rgba(255, 230, 237, .82)',
		groupLine: 'rgba(217, 79, 112, .28)',
		row1: 'rgba(255, 255, 255, .68)',
		row2: 'rgba(255, 239, 244, .76)',
		itemBorder: 'rgba(190, 90, 119, .14)',
		markColor: '#d94f70',
		ringColor: 'rgba(217, 79, 112, .22)',
		styles: {
			menu: { color: '#a43d5b', size: '20px' },
			title: { color: '#a83255', size: '50px' },
			group: { color: '#b43b5d', size: '18px' },
			item: { color: '#3f2e36', size: '16px' },
			desc: { color: '#705b64', size: '13px' },
			footer: { color: '#684c57', size: '14px', shadow: '0 1px 1px #fff' }
		}
	}
}

const HELP_LIST = [
	{
		name: '登录类',
		list: [{ name: '#QBot登录', desc: '登录开放平台' }]
	},
	{
		name: '功能类',
		list: [
			{ name: '#QBot列表', desc: '开放平台列表' },
			{ name: '#QBot通知', desc: '开放平台通知' },
			{ name: '#QBot订阅', desc: '开放平台事件订阅' },
			{ name: '#QBot数据 [天数]', desc: '开放平台数据统计，可选天数' },
			{
				name: '#QBot[消息]模板[列表]',
				desc: '开放平台消息模板，方括号内容可选'
			},
			{ name: '#QBot更新ip [IP]', desc: '更新开放平台白名单 IP' }
		]
	},
	{
		name: '统计类',
		list: [{ name: '#QBot[用户|群聊]统计', desc: '机器人用户和群聊统计，方括号内容可选' }]
	},
	{
		name: '插件管理',
		list: [
			{ name: '#QBot帮助', desc: '显示本帮助菜单' },
			{ name: '#QBot[插件]版本', desc: '查看插件版本和更新记录，方括号内容可选' },
			{ name: '#QBot[插件][强制]更新[日志]', desc: '更新插件，方括号内容可选' }
		]
	}
]

export class help extends plugin {
	constructor() {
		super({
			name: '[help.js]QBot帮助',
			dsc: 'QQ开放平台',
			event: 'message',
			priority: Config.admin.priority,
			rule: [
				{
					reg: `^#?${Config.admin.reg}帮助$`,
					fnc: 'help'
				}
			]
		})
	}

	async help(e) {
		const defaultFooter = `Created By ${Version.name} ${Version.yunzai} & ${Plugin_Name} ${Version.ver || ''} & @02`
		const theme = {
			...HELP_CONFIG.theme,
			footer: defaultFooter
		}
		const html = renderHelp({
			title: HELP_CONFIG.title,
			columns: HELP_CONFIG.columns,
			baseDir: Plugin_Path,
			theme,
			list: HELP_LIST.filter((group) => !(group?.auth === 'master' && !e.isMaster))
		})

		const img = await common.render('help/generated', { html }, { e, scale: 1 })
		e.reply([img, new Buttons().QBot()])
	}
}
