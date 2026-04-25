// prisma/seed.ts — Seed demo data for development/testing
// Run: npx tsx prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { addDays, addHours, startOfWeek, setHours, setMinutes } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo12345', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@smartcal.ai' },
    update: {},
    create: {
      email: 'demo@smartcal.ai',
      name: 'Alex Johnson',
      password: hashedPassword,
      timezone: 'America/New_York',
      preferences: { darkMode: true, notifications: true, weekStart: 1 },
    },
  })

  console.log('✅ Created user:', user.email)

  // Create sample goals
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        userId: user.id,
        title: 'Complete Machine Learning Course',
        description: 'Finish the Stanford ML course on Coursera',
        type: 'long-term',
        category: 'learning',
        targetDate: addDays(new Date(), 60),
        hoursPerWeek: 8,
        progress: 35,
        status: 'active',
      },
    }),
    prisma.goal.create({
      data: {
        userId: user.id,
        title: 'Run 5K in under 25 minutes',
        type: 'short-term',
        category: 'fitness',
        targetDate: addDays(new Date(), 30),
        hoursPerWeek: 4,
        progress: 60,
        status: 'active',
      },
    }),
    prisma.goal.create({
      data: {
        userId: user.id,
        title: 'Launch side project MVP',
        description: 'Build and launch my SaaS product',
        type: 'long-term',
        category: 'work',
        targetDate: addDays(new Date(), 90),
        hoursPerWeek: 10,
        progress: 20,
        status: 'active',
      },
    }),
  ])

  console.log('✅ Created goals:', goals.length)

  // Create habits
  const habits = await Promise.all([
    prisma.habit.create({ data: { userId: user.id, name: 'Morning meditation', frequency: 'daily', timeOfDay: 'morning', duration: 15, streak: 7 } }),
    prisma.habit.create({ data: { userId: user.id, name: 'Evening reading', frequency: 'daily', timeOfDay: 'evening', duration: 30, streak: 14 } }),
    prisma.habit.create({ data: { userId: user.id, name: 'Weekly review', frequency: 'weekly', timeOfDay: 'morning', duration: 60, streak: 3 } }),
  ])

  console.log('✅ Created habits:', habits.length)

  // Create this week's events
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })

  const eventData = [
    { title: 'Team standup', day: 0, startH: 9, endH: 9.5, category: 'work', priority: 'medium' },
    { title: 'Deep work: ML course', day: 0, startH: 10, endH: 12, category: 'learning', priority: 'high' },
    { title: 'Lunch with Sarah', day: 0, startH: 12.5, endH: 13.5, category: 'social', priority: 'low' },
    { title: 'Morning run', day: 1, startH: 7, endH: 7.75, category: 'fitness', priority: 'high' },
    { title: 'Product roadmap review', day: 1, startH: 10, endH: 11.5, category: 'work', priority: 'high' },
    { title: 'ML course lecture', day: 1, startH: 14, endH: 16, category: 'learning', priority: 'high' },
    { title: 'Doctor appointment', day: 2, startH: 9, endH: 10, category: 'health', priority: 'high' },
    { title: 'Team standup', day: 2, startH: 10.5, endH: 11, category: 'work', priority: 'medium' },
    { title: 'Side project coding', day: 2, startH: 14, endH: 17, category: 'work', priority: 'high' },
    { title: 'Morning run', day: 3, startH: 7, endH: 7.75, category: 'fitness', priority: 'high' },
    { title: 'Client presentation', day: 3, startH: 11, endH: 12, category: 'work', priority: 'high' },
    { title: 'Lunch break', day: 3, startH: 12, endH: 13, category: 'personal', priority: 'low' },
    { title: '1:1 with manager', day: 3, startH: 15, endH: 16, category: 'work', priority: 'medium' },
    { title: 'Gym session', day: 4, startH: 7, endH: 8.5, category: 'fitness', priority: 'high' },
    { title: 'Team standup', day: 4, startH: 9, endH: 9.5, category: 'work', priority: 'medium' },
    { title: 'Code review', day: 4, startH: 10, endH: 11.5, category: 'work', priority: 'medium' },
    { title: 'Weekly planning', day: 4, startH: 16, endH: 17, category: 'personal', priority: 'medium' },
  ]

  const events = await Promise.all(
    eventData.map(({ title, day, startH, endH, category, priority }) => {
      const startTime = setMinutes(setHours(addDays(weekStart, day), Math.floor(startH)), (startH % 1) * 60)
      const endTime = setMinutes(setHours(addDays(weekStart, day), Math.floor(endH)), (endH % 1) * 60)
      return prisma.event.create({
        data: { userId: user.id, title, startTime, endTime, category, priority, status: 'scheduled' },
      })
    })
  )

  console.log('✅ Created events:', events.length)
  console.log('\n🎉 Seeding complete!')
  console.log('   Email: demo@smartcal.ai')
  console.log('   Password: demo12345')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
