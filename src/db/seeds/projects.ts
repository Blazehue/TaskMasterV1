import { db } from '@/db';
import { projects } from '@/db/schema';

async function main() {
    const sampleProjects = [
        {
            title: 'Website Redesign',
            description: 'Complete overhaul of the company website for better user experience and modern aesthetics.',
            taskCount: 12,
            completedTasks: 8,
            dueDate: new Date('2024-07-30').toISOString(),
            category: 'Design',
            createdAt: new Date('2024-05-01').toISOString(),
            updatedAt: new Date('2024-06-15').toISOString(),
        },
        {
            title: 'Mobile App Development',
            description: 'Development of an iOS and Android application with core features for Q3 launch.',
            taskCount: 25,
            completedTasks: 15,
            dueDate: new Date('2024-08-20').toISOString(),
            category: 'Development',
            createdAt: new Date('2024-04-10').toISOString(),
            updatedAt: new Date('2024-06-25').toISOString(),
        },
        {
            title: 'Marketing Campaign Q4',
            description: 'Planning and execution of the end-of-year marketing campaign across all digital channels.',
            taskCount: 8,
            completedTasks: 3,
            dueDate: new Date('2024-09-15').toISOString(),
            category: 'Marketing',
            createdAt: new Date('2024-05-15').toISOString(),
            updatedAt: new Date('2024-06-01').toISOString(),
        },
        {
            title: 'E-commerce Platform',
            description: 'Building a robust e-commerce solution with integrated payment gateways and inventory management.',
            taskCount: 30,
            completedTasks: 20,
            dueDate: new Date('2024-08-01').toISOString(),
            category: 'Development',
            createdAt: new Date('2024-03-20').toISOString(),
            updatedAt: new Date('2024-06-20').toISOString(),
        },
        {
            title: 'Brand Identity Refresh',
            description: 'Revisiting and updating the company\'s brand guidelines, logo, and visual assets.',
            taskCount: 6,
            completedTasks: 6,
            dueDate: new Date('2024-06-10').toISOString(),
            category: 'Design',
            createdAt: new Date('2024-05-05').toISOString(),
            updatedAt: new Date('2024-06-10').toISOString(),
        },
        {
            title: 'Social Media Strategy',
            description: 'Developing a comprehensive social media strategy for increased engagement and brand awareness.',
            taskCount: 10,
            completedTasks: 7,
            dueDate: new Date('2024-07-05').toISOString(),
            category: 'Marketing',
            createdAt: new Date('2024-05-20').toISOString(),
            updatedAt: new Date('2024-06-10').toISOString(),
        },
        {
            title: 'API Integration Project',
            description: 'Integrating third-party APIs for enhanced functionality and data exchange within our systems.',
            taskCount: 15,
            completedTasks: 10,
            dueDate: new Date('2024-09-01').toISOString(),
            category: 'Development',
            createdAt: new Date('2024-04-25').toISOString(),
            updatedAt: new Date('2024-06-18').toISOString(),
        },
        {
            title: 'User Research Study',
            description: 'Conducting in-depth user research to understand pain points and inform future product development.',
            taskCount: 5,
            completedTasks: 2,
            dueDate: new Date('2024-07-25').toISOString(),
            category: 'Research',
            createdAt: new Date('2024-06-01').toISOString(),
            updatedAt: new Date('2024-06-20').toISOString(),
        }
    ];

    await db.insert(projects).values(sampleProjects);

    console.log('✅ Projects seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});