import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
