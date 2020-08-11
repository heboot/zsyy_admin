// 系统管理
export const systemRouter = [
  // 角色权限
  {
    id: 111,
    path: '/rolepermission',
    icon: 'locked',
    component: resolve => {
      require(['@/views/system/role-permission.vue'], resolve)
    }
  },
  // 角色管理
  {
    id: 2,
    path: '/rolemanage',
    icon: 'person',
    component: resolve => {
      require(['@/views/system/Role.vue'], resolve)
    }
  },
  // 部门管理
  {
    id: 4,
    path: '/departmental_management',
    icon: 'clipboard',
    component: resolve => {
      require(['@/views/system/departmental-mgt.vue'], resolve)
    }
  },
  // 用户管理
  {
    id:3,
    path: '/user_management',
    icon: 'person',
    component: resolve => {
      require(['@/views/system/user-mgt.vue'], resolve)
    }
  },
   // 意见反馈
   {
    id:233,
    path: '/user_sugg',
    icon: 'person',
    component: resolve => {
      require(['@/views/system/user-sugg.vue'], resolve)
    }
  },
  // 系统日志
  {
    id:7,
    path: '/system_log',
    icon: 'clipboard',
    component: resolve => {
      require(['@/views/system//system-log.vue'], resolve)
    }
  },
    //参数配置
  {
    id:237,
    path: '/system_set',
    icon: 'clipboard',
    component: resolve => {
      require(['@/views/system/system-set.vue'], resolve)
    }
  },
];

