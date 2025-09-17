import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product/product.entity';
import { SellerEntity } from './seller/seller.entity';
import * as bcrypt from 'bcrypt';

//error fixed 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Seed demo seller and products if empty
  try {
    const productRepo = app.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    const sellerRepo = app.get<Repository<SellerEntity>>(getRepositoryToken(SellerEntity));

    const productCount = await productRepo.count();
    // Always seed products if count is less than 10 (to add new products)
    if (productCount < 10) {
      let demoSeller = await sellerRepo.findOne({ where: { email: 'demo.seller@example.com' } });
      if (!demoSeller) {
        demoSeller = sellerRepo.create({
          name: 'Demo Seller',
          age: 30,
          email: 'demo.seller@example.com',
          nidNumber: '1234567890123',
          nidImage: 'demo-nid.png',
          password: await bcrypt.hash('Demo@1234', 10),
          status: 'active',
        });
        demoSeller = await sellerRepo.save(demoSeller);
      }

      const demoProducts: Partial<ProductEntity>[] = [
        { title: 'Sample T-Shirt', description: 'Soft cotton tee for everyday wear', category: 'Apparel', price: 19.99, stock: 100, inStock: true },
        { title: 'Wireless Earbuds', description: 'Bluetooth 5.0, great sound', category: 'Electronics', price: 49.99, stock: 50, inStock: true },
        { title: 'Coffee Mug', description: 'Ceramic mug 350ml', category: 'Home & Kitchen', price: 9.99, stock: 200, inStock: true },
        { title: 'Notebook', description: 'A5 dotted, 120 pages', category: 'Stationery', price: 6.5, stock: 300, inStock: true },
        { title: 'Running Shoes', description: 'Comfortable and lightweight', category: 'Footwear', price: 79.0, stock: 25, inStock: true },
        // Additional realistic products
        { title: 'Premium Cotton T-Shirt', description: '100% organic cotton, comfortable fit, available in multiple colors', category: 'Clothing', price: 24.99, stock: 75, inStock: true },
        { title: 'Samsung Galaxy S24', description: 'Latest flagship smartphone with AI camera and 5G connectivity', category: 'Electronics', price: 899.99, stock: 15, inStock: true },
        { title: 'Nike Air Max 270', description: 'Comfortable running shoes with Max Air cushioning technology', category: 'Footwear', price: 129.99, stock: 30, inStock: true },
        { title: 'MacBook Pro 14-inch', description: 'Apple M3 chip, 16GB RAM, 512GB SSD, perfect for professionals', category: 'Computers', price: 1999.99, stock: 8, inStock: true },
        { title: 'Kitchen Knife Set', description: 'Professional 8-piece stainless steel knife set with wooden block', category: 'Home & Kitchen', price: 89.99, stock: 40, inStock: true },
      ];

      for (const p of demoProducts) {
        const entity = productRepo.create({ ...p, seller: { id: demoSeller.id } as any });
        await productRepo.save(entity);
      }
      // eslint-disable-next-line no-console
      console.log('[seed] Inserted demo seller and products');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[seed] Skipped demo data seed:', err?.message || err);
  }
  
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
