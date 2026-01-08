import { Config } from '#components'
import { Login } from '#model'

export class Qlogin extends plugin {
  constructor() {
    super({
      name: '[login.js]QBot登录',
      dsc: 'QQ开放平台',
      event: 'message',
      priority: Config.admin.priority,
      rule: [
        {
          reg: `^#?${Config.admin.reg}登录$`,
          fnc: 'login'
        }
      ]
    })
  }

  async login(e) {
    await Login.login(e)
  }
}
