import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { SellerEntity } from '../seller/seller.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  private getImageUrl(filename?: string): string  {
    
    const baseUrl =  'http://localhost:3333';
    return `${baseUrl}/uploads/products/${filename}`;
  }

  // Create a new product with optional image
  async createProduct(
    data: Partial<ProductEntity>,
    sellerId: number,
    file?: Express.Multer.File,
  ): Promise<ProductEntity> {
    const imagePath = file ? file.filename : undefined;

    const product = this.productRepository.create({
      ...data,
      seller: { id: sellerId } as SellerEntity,
      image: imagePath,
    });

    const savedProduct = await this.productRepository.save(product);
    savedProduct.image = this.getImageUrl(savedProduct.image);
    return savedProduct;
  }

  // Update product (PATCH) with optional file and seller ownership check
  async updateProduct(
    id: number,
    data: Partial<ProductEntity>,
    sellerId: number,
    file?: Express.Multer.File,
  ): Promise<ProductEntity> {
    const product = await this.getProductById(id);

    if (product.seller.id !== sellerId) {
      throw new ForbiddenException('You can only update your own products');
    }

    if (file) {
      data.image = file.filename;
    }

    const updatedProduct = this.productRepository.merge(product, data);
    const savedProduct = await this.productRepository.save(updatedProduct);
    savedProduct.image = this.getImageUrl(savedProduct.image);
    return savedProduct;
  }

  // Get all products with seller info
  async getProductInfo(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      relations: ['seller'],
    });
    return products.map((product) => ({
      ...product,
      image: this.getImageUrl(product.image),
    }));
  }

  // Get a product by ID with seller info
  async getProductById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!product) throw new NotFoundException('Product not found');

    return {
      ...product,
      image: this.getImageUrl(product.image),
    };
  }

  // Get seller name by product ID
  async getOnlySellerName(productId: number): Promise<string> {
    const product = await this.getProductById(productId);
    if (!product.seller || !product.seller.name) {
      throw new NotFoundException('Seller not found');
    }
    return product.seller.name;
  }

  // Delete product by ID with seller ownership check
  async deleteProductById(
    id: number,
    sellerId: number,
  ): Promise<{ message: string }> {
    const product = await this.getProductById(id);

    if (product.seller.id !== sellerId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.productRepository.remove(product);
    return { message: `Product with ID ${id} deleted successfully` };
  }

  // Get products by category with optional sorting and pagination
  async getProductsByCategory(
    category: string,
    sort: keyof ProductEntity = 'id',
    limit = 10,
    page = 1,
  ): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      where: { category },
      order: { [sort]: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['seller'],
    });
    return products.map((product) => ({
      ...product,
      image: this.getImageUrl(product.image),
    }));
  }

  // Browse all products
  async browseProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({ relations: ['seller'] });
    return products.map((product) => ({
      ...product,
      image: this.getImageUrl(product.image),
    }));
  }

  // Get all products for a specific seller
  async getProductsBySeller(sellerId: number): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      where: { seller: { id: sellerId } },
      relations: ['seller'],
    });
    return products.map((product) => ({
      ...product,
      image: this.getImageUrl(product.image),
    }));
  }

  // Get all unique seller IDs from products
  async getSellerIds(): Promise<number[]> {
    const products = await this.productRepository.find({
      relations: ['seller'],
    });
    return Array.from(
      new Set(products.map((p) => p.seller?.id).filter(Boolean)),
    );
  }
}
