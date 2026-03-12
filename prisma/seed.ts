import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL?.replace(
  /([?&])sslmode=(?:prefer|require|verify-ca)(?=&|$)/i,
  '$1sslmode=verify-full'
)

const adapter = new PrismaPg({
  connectionString: connectionString!,
})

const prisma = new PrismaClient({ adapter })

const ProductType = {
  PHYSICAL: 'PHYSICAL',
  DIGITAL: 'DIGITAL',
} as const

const products = [
  {
    name: 'Livro - Territórios Vivos: Guía Prático de Inteligência Territorial',
    description: 'Uma guía completa sobre inteligência territorial e desenvolvimento sustentável de comunidades.',
    price: 89.9,
    type: ProductType.PHYSICAL,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    amazonUrl: 'https://www.amazon.com/dp/XXXXX',
  },
  {
    name: 'Artigo Digital - Manual de Turismo Regenerativo',
    description: 'PDF completo sobre turismo regenerativo e economia criativa.',
    price: 29.9,
    type: ProductType.DIGITAL,
    stock: 999,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
  },
  {
    name: 'Artigo Digital - Cartilha de Economia Criativa',
    description: 'Guia prático sobre economia criativa para pequenos negócios.',
    price: 19.9,
    type: ProductType.DIGITAL,
    stock: 999,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
  },
  {
    name: 'Camiseta - Coleção Território Vibrante (Preta - P)',
    description: 'Camiseta preta com logo da Território Vibrante. Tamanho P.',
    price: 79.9,
    type: ProductType.PHYSICAL,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  },
  {
    name: 'Camiseta - Coleção Território Vibrante (Preta - M)',
    description: 'Camiseta preta com logo da Território Vibrante. Tamanho M.',
    price: 79.9,
    type: ProductType.PHYSICAL,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  },
  {
    name: 'Camiseta - Coleção Território Vibrante (Preta - G)',
    description: 'Camiseta preta com logo da Território Vibrante. Tamanho G.',
    price: 79.9,
    type: ProductType.PHYSICAL,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  },
  {
    name: 'Chaveiro - Território Vibrante',
    description: 'Chaveiro de metal com logo da Território Vibrante.',
    price: 25.0,
    type: ProductType.PHYSICAL,
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
  },
  {
    name: 'Agenda 2026 - Planejamento Territorial',
    description: 'Agenda anual 2026 com planner territorial. Capa dura.',
    price: 59.9,
    type: ProductType.PHYSICAL,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
  },
  {
    name: 'Mapa - Brasil Colonizado',
    description: 'Mapa decorativo do Brasil colonial style.',
    price: 45.0,
    type: ProductType.PHYSICAL,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400',
  },
  {
    name: 'Mapa - Mundo das Culturas',
    description: 'Mapa mundial decorativo com foco na diversidade cultural.',
    price: 55.0,
    type: ProductType.PHYSICAL,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400',
  },
]

async function main() {
  console.log('Seeding products...')

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
