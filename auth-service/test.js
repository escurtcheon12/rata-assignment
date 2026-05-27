"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var adapter_pg_1 = require("@prisma/adapter-pg");
var client_1 = require("@prisma/client");
console.log('PrismaPg:', typeof adapter_pg_1.PrismaPg);
console.log('PrismaClient:', typeof client_1.PrismaClient);
