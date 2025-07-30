import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  createProduct() {
    return { message: 'Product created successfully' };
  }

  getProductInfo() {
    return { message: 'Product information' };
  }

  deleteProduct() {
    return { message: 'Product deleted successfully' };
  }
  getProductsByCategory(
    category: string,
    sort: string,
    limit: number,
    page: number,
  ) {
    return {
      message: `Products in category ${category} sorted by ${sort}, limit ${limit}, page ${page}`,
    };
  }
  browseProducts() {
    return { message: 'Browsing all products' };
  }
}
