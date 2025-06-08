import process from 'node:process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
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
