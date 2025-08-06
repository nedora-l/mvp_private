/**
 * User preferences and features interfaces for the Checkpara API
 */

// Favorite product
export interface FavoriteProductDto {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: {
    min: number;
    max: number;
    currency: string;
  };
  dateAdded: string;
}
