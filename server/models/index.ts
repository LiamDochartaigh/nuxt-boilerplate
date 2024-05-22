import mongoose from 'mongoose';

const {db_url} = useRuntimeConfig();
mongoose.connect(db_url);
mongoose.Promise = global.Promise

// Export Mongoose connection
const db = {
  mongoose,
  user: require('./userModel').default,
  order: require('./orderModel').default,
  product: require('./productModel').default,
  checkoutSession: require('./checkoutSessionModel').default,
}

export default db;