import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ImagesRouter } from './routes/img.router';
import { ValidateEnv } from '@utils/validateEnv';
import { ProductRoute } from './routes/products.router';
import { CategoryRoute } from './routes/categories.router';
import { AdminRoute } from './routes/admins.router';
import { FavoriteRoute } from './routes/favorite.router';
import { OrderRoute } from './routes/orders.router';

ValidateEnv();

const app = new App([
  new UserRoute(),
  new AuthRoute(),
  new ImagesRouter(),
  new CategoryRoute(),
  new ProductRoute(),
  new AdminRoute(),
  new FavoriteRoute(),
  new OrderRoute(),
]);
app.listen();
