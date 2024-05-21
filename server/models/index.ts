import { useAppConfig } from 'nuxt/app';
import mongoose from 'mongoose';

const config = useAppConfig();

const dbUrl = config;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.Promise = global.Promise

// Export Mongoose connection
const db = {
  mongoose,
  user: require('./userModel').default,
  order: require('./orderModel').default,
  product: require('./productModel').default,
  checkoutSession: require('./checkoutSessionModel').default,
}