export default [
  {
    component: "SOFT_GROUP_BEGIN",
    label: "QBot配置"
  },
  {
    field: "QBotSet.markdown",
    label: "markdown模式",
    componentProps: {
      options: [
        { label: "不使用", value: 0 },
        { label: "md格式", value: 1 },
        { label: "json格式", value: 2 }
      ],
      placeholder: "请选择模式"
    },
    component: "RadioGroup"
  },
  {
    field: "QBotSet.arklogin",
    label: "ark模板登录",
    component: "Switch"
  },
  {
    field: "QBotSet.day",
    label: "dau显示天数",
    required: true,
    componentProps: {
      placeholder: "请输入数字"
    },
    component: "InputNumber"
  },
  {
    field: "QBotSet.count",
    label: "QBot统计",
    component: "Switch"
  }
]
