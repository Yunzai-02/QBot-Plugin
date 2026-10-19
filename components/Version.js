import fs from "node:fs"
import lodash from "lodash"
import { Data, Plugin_Path } from "./index.js"

const CHANGELOG_path = `${Plugin_Path}/CHANGELOG.md`
const README_path = `${Plugin_Path}/README.md`

let PluginPackagePath = `${Plugin_Path}/package.json`
let PluginPackageData = JSON.parse(fs.readFileSync(PluginPackagePath, "utf8"))
let packageJson = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, "utf8"))

// let yunzai_ver = packageJson.version

let changelogs = []
let currentVersion
let logs = {}
let versionCount = 3

const getLine = function (line) {
  line = line.replace(/(^\s*\*|\r)/g, "")
  line = line.replace(/\s*`([^`]+`)/g, '<span class="cmd">$1')
  line = line.replace(/`\s*/g, "</span>")
  line = line.replace(/\s*\*\*([^*]+\*\*)/g, '<span class="strong">$1')
  line = line.replace(/\*\*\s*/g, "</span>")
  line = line.replace(/ⁿᵉʷ/g, '<span class="new"></span>')
  return line
}

const readLogFile = function (root, versionCount = 4) {
  root = Data.getRoot(root)
  let changelogs = []
  let currentVersion
  let logPath = `${root}/CHANGELOG.md`
  let logs = {}

  try {
    if (fs.existsSync(logPath)) {
      logs = fs.readFileSync(logPath, "utf8") || ""
      logs = logs.split("\n")

      let temp = {}
      let lastLine = {}
      lodash.forEach(logs, (line) => {
        if (versionCount <= -1) {
          return false
        }
        let versionRet = /^#\s*([0-9a-zA-Z\\.~\s]+?)\s*$/.exec(line)
        if (versionRet && versionRet[1]) {
          let v = versionRet[1].trim()
          if (!currentVersion) {
            currentVersion = v
          } else {
            changelogs.push(temp)
            if (/0\s*$/.test(v) && versionCount > 0) {
              versionCount = 0
            } else {
              versionCount--
            }
          }

          temp = {
            version: v,
            logs: []
          }
        } else {
          if (!line.trim()) {
            return
          }
          if (/^\*/.test(line)) {
            lastLine = {
              title: getLine(line),
              logs: []
            }
            temp.logs.push(lastLine)
          } else if (/^\s{2,}\*/.test(line)) {
            lastLine.logs.push(getLine(line))
          }
        }
      })
    }
  } catch (e) {
    // do nth
  }
  return { changelogs, currentVersion }
}

try {
  if (fs.existsSync(CHANGELOG_path)) {
    logs = fs.readFileSync(CHANGELOG_path, "utf8") || ""
    logs = logs.replace(/\t/g, "   ").split("\n")
    let temp = {}
    let lastLine = {}
    lodash.forEach(logs, (line) => {
      if (versionCount < 1) {
        return false
      }
      let versionRet = /^#\s*([0-9a-zA-Z\\.~\s]+?)\s*$/.exec(line.trim())
      if (versionRet && versionRet[1]) {
        let v = versionRet[1].trim()
        if (!currentVersion) {
          currentVersion = v
        } else {
          changelogs.push(temp)
          if (/0\s*$/.test(v) && versionCount > 0) {
            // versionCount = 0
            versionCount--
          } else {
            versionCount--
          }
        }
        temp = {
          version: v,
          logs: []
        }
      } else {
        if (!line.trim()) {
          return
        }
        if (/^\*/.test(line)) {
          lastLine = {
            title: getLine(line),
            logs: []
          }
          if (!temp.logs) {
            temp = {
              version: line,
              logs: []
            }
          }
          temp.logs.push(lastLine)
        } else if (/^\s{2,}\*/.test(line)) {
          lastLine.logs.push(getLine(line))
        }
      }
    })
  }
} catch (e) {
  logger.error(e)
  // do nth
}

try {
  if (fs.existsSync(README_path)) {
    let README = fs.readFileSync(README_path, "utf8") || ""
    let reg = /版本：(.*)/.exec(README)
    if (reg) {
      currentVersion = reg[1]
    }
  }
} catch (err) {}

try {
  if (PluginPackageData.version !== currentVersion) {
    console.log(`[QBot-Plugin] 版本号不一致，更新版本号为: ${currentVersion}`)
    PluginPackageData.version = currentVersion

    fs.writeFileSync(PluginPackagePath, JSON.stringify(PluginPackageData, null, 2), "utf8")
    console.log("[QBot-Plugin] package.json 已更新")
  }
} catch (error) {
  console.error("读取或解析 package.json 出现错误:", error)
}

let { author } = PluginPackageData
const yunzaiVersion = packageJson.version
let name = "Yunzai-Bot"

let Version = {
  name,
  author,
  get version() {
    return currentVersion
  },
  get yunzai() {
    return yunzaiVersion
  },
  get logs() {
    return changelogs
  },
  get ver() {
    return currentVersion
  },
  readLogFile
}

export default Version
