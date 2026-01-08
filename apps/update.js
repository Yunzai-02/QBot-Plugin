import { update as Update } from '../../other/update.js'
import { Plugin_Name } from '#components'
import { Config } from '#components'

export class Qupdate extends plugin {
  constructor() {
    super({
      name: '[update.js]QBot更新',
      dsc: 'QQ开放平台',
      event: 'message',
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#${Config.admin.reg}(插件)?(强制)?更新(日志)?$`,
          fnc: 'update'
        }
      ]
    })
  }

  async update(e = this.e) {
    let isLog = e.msg.includes('日志')
    let Type = isLog ? '#更新日志' : e.msg.includes('强制') ? '#强制更新' : '#更新'
    e.msg = Type + Plugin_Name
    const up = new Update(e)
    up.e = e
    return isLog ? up.updateLog() : up.update()
  }
}
