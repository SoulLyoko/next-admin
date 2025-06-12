import process from 'node:process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const deptId = 'cmbmflf5q00023p6ky4ubakr0'
  await prisma.dept.upsert({
    where: { id: deptId },
    create: { id: deptId, name: 't0' },
    update: {},
  })
  const deptId2 = 'cmbn97c0s00023p6pa52i82cw'
  await prisma.dept.upsert({
    where: { id: deptId2 },
    create: { id: deptId2, name: 't1', parentId: deptId },
    update: {},
  })
  const deptId3 = 'cmboex0qh00003j6q398113nf'
  await prisma.dept.upsert({
    where: { id: deptId3 },
    create: { id: deptId3, name: 't2', parentId: deptId2 },
    update: {},
  })

  const postId = 'cmbmfixog00003p6k2alo7z2r'
  await prisma.post.upsert({
    where: { id: postId },
    create: { id: postId, name: 'manager' },
    update: {},
  })
  const postId2 = 'cmbn94iux00003p6pcgwep50x'
  await prisma.post.upsert({
    where: { id: postId2 },
    create: { id: postId2, name: 'developer' },
    update: {},
  })

  const roleId = 'cmbmfkv7s00013p6ktaw8ps06'
  await prisma.role.upsert({
    where: { id: roleId },
    create: { id: roleId, name: 'admin' },
    update: {},
  })
  const roleId2 = 'cmbn96bsa00013p6pttrqxl2k'
  await prisma.role.upsert({
    where: { id: roleId2 },
    create: { id: roleId2, name: 'user' },
    update: {},
  })

  const userId = 'cmbmfmu1e00033p6kskje2c2c'
  await prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      name: 'admin',
      password: '123456',
      posts: { create: { postId } },
      roles: { create: { roleId } },
      depts: { create: { deptId } },
    },
    update: {},
  })

  const menuIds = {
    sys: 'cmbohn6xg00013j6qtdyo1pml',
    sys_dept: 'cmbohnxux00033j6q6ubaq52k',
    sys_post: 'cmboho4ko00043j6qatm1qtc4',
    sys_role: 'cmbohoabw00053j6qafev69a1',
    sys_user: 'cmbohnl4600023j6q7cgfd7be',
    sys_menu: 'cmbohu27500063j6q2o6xfhgn',
    sys_dict: 'cmbq64efq0001sspwev8fomz9',
  }
  await prisma.menu.upsert({
    where: { id: menuIds.sys },
    create: {
      id: menuIds.sys,
      name: '系统管理',
      icon: 'ant-design:appstore-outlined',
      children: {
        createMany: {
          data: [
            { id: menuIds.sys_dept, name: '部门管理', path: '/sys/dept', icon: 'ant-design:cluster-outlined' },
            { id: menuIds.sys_post, name: '岗位管理', path: '/sys/post', icon: 'ant-design:idcard-outlined' },
            { id: menuIds.sys_role, name: '角色管理', path: '/sys/role', icon: 'ant-design:user-add-outlined' },
            { id: menuIds.sys_user, name: '用户管理', path: '/sys/user', icon: 'ant-design:user-outlined' },
            { id: menuIds.sys_menu, name: '菜单管理', path: '/sys/menu', icon: 'ant-design:appstore-add-outlined' },
            { id: menuIds.sys_dict, name: '数据字典', path: '/sys/dict', icon: 'ant-design:book-outlined' },
          ],
        },
      },
    },
    update: {},
  })

  const dictIds = {
    sex: 'cmbq74fx60000ssvo7dvdver5',
    sex_1: 'cmbq74q2y0002ssvor7zlqyfj',
    sex_0: 'cmbq750q30004ssvoikmh36ec',
    whether: 'cmbrrmjjz0004sslount9x09r',
    whether_0: 'cmbrrnga00006sslo90orny78',
    whether_1: 'cmbrrnlpi0008ssloxj3vz7ce',
  }
  await prisma.dict.upsert({
    where: { id: dictIds.sex },
    create: {
      id: dictIds.sex,
      label: '性别',
      value: 'sex',
      children: {
        createMany: {
          data: [
            { id: dictIds.sex_1, label: '男', value: '1' },
            { id: dictIds.sex_0, label: '女', value: '0' },
          ],
        },
      },
    },
    update: {},
  })
  await prisma.dict.upsert({
    where: { id: dictIds.whether },
    create: {
      id: dictIds.whether,
      label: '是否',
      value: 'whether',
      children: {
        createMany: {
          data: [
            { id: dictIds.whether_1, label: '否', value: '0' },
            { id: dictIds.whether_0, label: '是', value: '1 ' },
          ],
        },
      },
    },
    update: {},
  })
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
