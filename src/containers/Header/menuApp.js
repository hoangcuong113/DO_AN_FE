export const adminMenu = [
  {
    //hệ thống
    name: "menu.admin.manage-user",
    menus: [
      // {
      //   name: "menu.admin.crud",
      //   link: "/system/user-manage",
      //   // subMenus: [
      //   //   {
      //   //     name: "menu.system.system-administrator.user-manage",
      //   //     link: "/system/user-manage",
      //   //   },
      //   //   {
      //   //     name: "menu.system.system-administrator.redux-manage",
      //   //     link: "/system/user-redux",
      //   //   },
      //   // ],
      // },
      { name: "menu.admin.crud-redux", link: "/system/user-redux" },
      { name: "menu.admin.manage-doctor", link: "/system/manager-doctor" },
      { name: "menu.doctor.manage-schedule", link: "/doctor/manage-schedule" },
      // { name: "menu.admin.manage-password", link: "/system/manage-password" },
    ],
  },
  {
    //manager clinics
    name: "menu.admin.clinic",
    menus: [
      {
        name: "menu.admin.manage-clinic",
        link: "/system/manage-clinic",
      },
    ],
  },
  {
    //manager specialties
    name: "menu.admin.specialty",
    menus: [
      {
        name: "menu.admin.manage-specialty",
        link: "/system/manage-specialty",
      },
    ],
  },
  {
    //manager handbook
    name: "menu.admin.handbook",
    menus: [
      {
        name: "menu.admin.manage-handbook",
        link: "/system/manage-handbook",
      },
    ],
  },
];

export const doctorMenu = [
  {
    name: "menu.admin.manage-user",
    menus: [
      {
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
      {
        name: "menu.doctor.manage-appointment",
        link: "/doctor/manage-appointment",
      },
      {
        name: "menu.doctor.history-appointment",
        link: "/doctor/history-appointment",
      },
      // { name: "menu.admin.manage-password", link: "/system/manage-password" },
    ],
  },
  {
    //manager handbook
    name: "menu.admin.handbook",
    menus: [
      {
        name: "menu.admin.manage-handbook",
        link: "/system/manage-handbook",
      },
    ],
  },
];
