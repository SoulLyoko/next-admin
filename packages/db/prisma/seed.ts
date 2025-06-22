import type { Prisma } from '@prisma/client'
import process from 'node:process'
import { PrismaClient } from '@prisma/client'

class InitialData {
  menu: Prisma.MenuUncheckedCreateInput[] = []
  dict: Prisma.DictUncheckedCreateInput[] = []
  dept: Prisma.DeptUncheckedCreateInput[] = []
  post: Prisma.PostUncheckedCreateInput[] = []
  role: Prisma.RoleUncheckedCreateInput[] = []
  user: Prisma.UserUncheckedCreateInput[] = []

  constructor() {
    this.menu.push({ id: 'cmbohn6xg00013j6qtdyo1pml', name: '系统管理', path: 'sys', icon: 'ant-design:appstore-outlined' })
    this.menu.push({ parentId: this.menu[0]!.id, id: 'cmbohnxux00033j6q6ubaq52k', name: '部门管理', path: '/sys/dept', icon: 'ant-design:cluster-outlined' })
    this.menu.push({ parentId: this.menu[0]!.id, id: 'cmboho4ko00043j6qatm1qtc4', name: '岗位管理', path: '/sys/post', icon: 'ant-design:idcard-outlined' })
    this.menu.push({ parentId: this.menu[0]!.id, id: 'cmbohoabw00053j6qafev69a1', name: '角色管理', path: '/sys/role', icon: 'ant-design:user-add-outlined' })
    this.menu.push({ parentId: this.menu[0]!.id, id: 'cmbohnl4600023j6q7cgfd7be', name: '用户管理', path: '/sys/user', icon: 'ant-design:user-outlined' })
    this.menu.push({ parentId: this.menu[0]!.id, id: 'cmbohu27500063j6q2o6xfhgn', name: '菜单管理', path: '/sys/menu', icon: 'ant-design:appstore-add-outlined' })
    this.menu.push({ parentId: this.menu[0]!.id, id: 'cmbq64efq0001sspwev8fomz9', name: '数据字典', path: '/sys/dict', icon: 'ant-design:book-outlined' })
    this.menu.push({ parentId: this.menu[0]!.id, id: 'cmbv1bafq00174olq3q69sfli', name: '系统日志', path: '/sys/log', icon: 'ant-design:file-search-outlined' })
    this.menu.push({ parentId: this.menu[0]!.id, id: 'cmc0p17xy0003ssxwzkajpwou', name: '会话管理', path: '/sys/session', icon: 'ant-design:safety-outlined' })

    this.dict.push({ id: 'cmbq74fx60000ssvo7dvdver5', label: '性别', value: 'sex' })
    this.dict.push({ id: 'cmbrrmjjz0004sslount9x09r', label: '是否', value: 'whether' })
    this.dict.push({ parentId: this.dict[0]!.id, id: 'cmbq74q2y0002ssvor7zlqyfj', label: '男', value: '1' })
    this.dict.push({ parentId: this.dict[0]!.id, id: 'cmbq750q30004ssvoikmh36ec', label: '女', value: '0' })
    this.dict.push({ parentId: this.dict[1]!.id, id: 'cmbrrnga00006sslo90orny78', label: '否', value: '0' })
    this.dict.push({ parentId: this.dict[1]!.id, id: 'cmbrrnlpi0008ssloxj3vz7ce', label: '是', value: '1' })

    this.dept.push({ id: 'cmbmflf5q00023p6ky4ubakr0', name: 't0' })
    this.dept.push({ parentId: this.dept[0]!.id, id: 'cmbn97c0s00023p6pa52i82cw', name: 't1' })
    this.dept.push({ parentId: this.dept[1]!.id, id: 'cmboex0qh00003j6q398113nf', name: 't2' })

    this.post = []
    this.post.push({ id: 'cmbmfixog00003p6k2alo7z2r', name: '主管' })
    this.post.push({ id: 'cmbn94iux00003p6pcgwep50x', name: '员工' })

    this.role = []
    this.role.push({ id: 'cmbmfkv7s00013p6ktaw8ps06', name: '管理员', key: 'admin' })
    this.role.push({
      id: 'cmbn96bsa00013p6pttrqxl2k',
      name: '普通用户',
      key: 'user',
      menus: { createMany: { data: this.menu.map(menu => ({ menuId: menu.id! })) } },
    })

    this.user = []
    this.user.push({
      id: 'cmbmfmu1e00033p6kskje2c2c',
      name: 'admin',
      nickname: '管理员',
      sex: '1',
      phone: '13888888888',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      posts: { create: { postId: this.post[0]!.id! } },
      roles: { create: { roleId: this.role[0]!.id! } },
      depts: { create: { deptId: this.dept[0]!.id! } },
    })
    this.user.push({
      id: 'cmbyjcbl0001zssgc7tn80lzd',
      name: 'user',
      nickname: '普通用户',
      sex: '1',
      phone: '13999999999',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      posts: { create: { postId: this.post[1]!.id! } },
      roles: { create: { roleId: this.role[1]!.id! } },
      depts: { create: { deptId: this.dept[1]!.id! } },
    })
  }
}

const prisma = new PrismaClient()
async function main() {
  const data = new InitialData()
  prisma.role.create({
    data,
  })
  for (const [key, value] of Object.entries(data)) {
    for (const item of value) {
      // @ts-expect-error
      await prisma[key]?.upsert({
        where: { id: item.id },
        create: item,
        update: {},
      })
    }
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
