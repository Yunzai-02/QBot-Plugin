import { Version, common } from '#components'
import { Config } from '#components'
import { Buttons } from '#model'

export class QVersion extends plugin {
  constructor() {
    super({
      name: '[update.js]QBot版本',
      dsc: 'QQ开放平台',
      event: 'message',
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}(插件)?版本$`,
          fnc: 'plugin_version'
        }
      ]
    })
  }

  async plugin_version(e) {
    const img = await common.render(
      'help/version-info',
      {
        currentVersion: Version.ver,
        changelogs: Version.logs
      },
      { e, scale: 1.4 }
    )
    return e.reply([img, new Buttons().QBot()])
  }
}
