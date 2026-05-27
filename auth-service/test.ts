import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';

console.log('PrismaPg:', typeof PrismaPg);
console.log('PrismaClient:', typeof PrismaClient);
