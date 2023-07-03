export const cameraType = [{
        label: "海康威视",
        value: 0,
    },
    {
        label: "大华",
        value: 1,
    },
]

export const stateType = [{
        label: "所有",
        value: -1,
    },
    {
        label: "正在渲染队列中",
        value: 0,
    },
    {
        label: "渲染中",
        value: 1,
    },
    {
        label: "渲染完成",
        value: 2,
    },
    {
        label: "渲染错误",
        value: 3,
    },
    {
        label: "渲染结果已被删除",
        value: 4,
    }
]

export const userRole = [{
    label: '员工',
    value: 'ROLE_USER'
},{
    label: '管理员',
    value: 'ROLE_ADMIN'
},{
    label: '部门经理',
    value: 'ROLE_MANAGE'
}]