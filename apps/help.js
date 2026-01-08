import lodash from 'lodash'
import { Config, common, Data } from '#components'
import { Buttons } from '#model'
import Theme from '../model/help/theme.js'

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
    let custom = {}
    let help = {}

    let { diyCfg, sysCfg } = await Data.importCfg('help')
    custom = help

    let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg)
    let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList
    let helpGroup = []

    lodash.forEach(helpList, group => {
      if (group.auth && group.auth === 'master' && !e.isMaster) {
        return true
      }

      lodash.forEach(group.list, help => {
        let icon = help.icon * 1
        if (!icon) {
          help.css = 'display:none'
        } else {
          let x = (icon - 1) % 10
          let y = (icon - x - 1) / 10
          help.css = `background-position:-${x * 50}px -${y * 50}px`
        }
      })

      helpGroup.push(group)
    })
    let themeData = await Theme.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {})

    const img = await common.render(
      'help/index',
      {
        helpCfg: helpConfig,
        helpGroup,
        ...themeData
      },
      { e, scale: 1.6 }
    )
    e.reply([img, new Buttons().QBot()])
  }
}
