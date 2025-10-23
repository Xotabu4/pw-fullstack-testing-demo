import { AuthController } from "./auth.controller";
import { ProductController } from "./product.controller";
import { CartController } from "./cart.controller";
import { OrderController } from "./order.controller";
import { WishlistController } from "./wishlist.controller";
import { AddressController } from "./address.controller";
import { ReviewController } from "./review.controller";
import { NewsletterController } from "./newsletter.controller";
import { RequestHolder } from "./requestHolder";

export class API extends RequestHolder {
  public readonly auth = new AuthController(this.request);
  public readonly product = new ProductController(this.request);
  public readonly cart = new CartController(this.request);
  public readonly order = new OrderController(this.request);
  public readonly wishlist = new WishlistController(this.request);
  public readonly address = new AddressController(this.request);
  public readonly review = new ReviewController(this.request);
  public readonly newsletter = new NewsletterController(this.request);
}
