import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  // Create product and attach seller
  async createProduct(
    data: Partial<ProductEntity>,
    sellerId: number,
  ): Promise<ProductEntity> {
    const product = this.productRepository.create({
      ...data,
      seller: { id: sellerId },
    });
    return await this.productRepository.save(product);
  }

  async getProductInfo(): Promise<ProductEntity[]> {
    return await this.productRepository.find({ relations: ['seller'] });
  }

  
  async getSellerIds(): Promise<number[]> {
    const products = await this.productRepository.find({ relations: ['seller'] });
    const sellerIds = products
      .map(product => product.seller?.id)
      .filter((id, index, arr) => id !== undefined && arr.indexOf(id) === index);
    return sellerIds;
  }
  async getProductById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getOnlySellerName(productId: number): Promise<number> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['seller'], 
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Return the seller's name
    return product.seller.id;
  }

  async updateProduct(
    id: number,
    data: Partial<ProductEntity>,
    sellerId?: number,
  ): Promise<ProductEntity> {
    const product = await this.getProductById(id);
    // Optional: check seller ownership
    if (sellerId && product.seller.id !== sellerId) {
      throw new NotFoundException('You can only update your own products');
    }
    await this.productRepository.update(id, data);
    return this.getProductById(id);
  }

  async deleteProductById(id: number, sellerId?: number): Promise<{ message: string }> {
    const product = await this.getProductById(id);
    if (sellerId && product.seller.id !== sellerId) {
      throw new NotFoundException('You can only delete your own products');
    }
    const result = await this.productRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Product not found');
    return { message: `Product with ID ${id} deleted successfully` };
  }

  async getProductsByCategory(
    category: string,
    sort: string = 'id',
    limit: number = 10,
    page: number = 1,
  ): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: { category },
      order: { [sort]: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['seller'],
    });
  }

  async browseProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.find({ relations: ['seller'] });
  }

  async getProductsBySeller(sellerId: number): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: { seller: { id: sellerId } },
    });
  }

  // ---------- New: Paginated listing with filters ----------
  async listProducts(options: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: 'createdAt' | 'price' | 'title' | 'id';
    sortDir?: 'ASC' | 'DESC';
  }): Promise<{ data: ProductEntity[]; total: number; page: number; limit: number }>{
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      sortDir = 'DESC',
    } = options || {};

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller');

    if (category) qb.andWhere('product.category = :category', { category });
    if (minPrice !== undefined) qb.andWhere('product.price >= :minPrice', { minPrice });
    if (maxPrice !== undefined) qb.andWhere('product.price <= :maxPrice', { maxPrice });
    if (inStock !== undefined) qb.andWhere('product.inStock = :inStock', { inStock });

    qb.orderBy(`product.${sortBy}`, sortDir)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  // ---------- New: Full-text-ish search ----------
  async searchProducts(params: {
    q: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'price' | 'title' | 'id';
    sortDir?: 'ASC' | 'DESC';
  }): Promise<{ data: ProductEntity[]; total: number; page: number; limit: number }>{
    const { q, page = 1, limit = 12, sortBy = 'createdAt', sortDir = 'DESC' } = params;
    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .where(new Brackets((qbWhere) => {
        qbWhere
          .where('LOWER(product.title) LIKE :q')
          .orWhere('LOWER(product.description) LIKE :q')
          .orWhere('LOWER(product.category) LIKE :q');
      }))
      .setParameter('q', `%${q.toLowerCase()}%`)
      .orderBy(`product.${sortBy}`, sortDir)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  // ---------- New: Review stats (avg rating, counts) ----------
  async getReviewStats(productId: number): Promise<{
    productId: number;
    averageRating: number;
    totalReviews: number;
    counts: { [star: number]: number };
  }>{
    // Using query builder over ReviewEntity table via relation
    const rows = await this.productRepository.query(
      `SELECT r.rating as rating, COUNT(*) as count
       FROM review r
       WHERE r.productId = $1 AND r."isVisible" = true
       GROUP BY r.rating`,
      [productId],
    );

    let total = 0;
    let sum = 0;
    const counts: { [k: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of rows) {
      const rating = Number(row.rating);
      const count = Number(row.count);
      counts[rating] = count;
      total += count;
      sum += rating * count;
    }
    const average = total > 0 ? Number((sum / total).toFixed(2)) : 0;
    return { productId, averageRating: average, totalReviews: total, counts };
  }

  // ---------- New: Stock helpers ----------
  async setStock(productId: number, stock: number): Promise<ProductEntity> {
    const product = await this.getProductById(productId);
    product.stock = stock;
    product.inStock = stock > 0;
    await this.productRepository.save(product);
    return product;
  }

  async changeStock(productId: number, delta: number): Promise<ProductEntity> {
    const product = await this.getProductById(productId);
    const next = Math.max(0, (product.stock || 0) + delta);
    product.stock = next;
    product.inStock = next > 0;
    await this.productRepository.save(product);
    return product;
  }

  async setInStock(productId: number, inStock: boolean): Promise<ProductEntity> {
    const product = await this.getProductById(productId);
    product.inStock = inStock;
    await this.productRepository.save(product);
    return product;
  }
}
