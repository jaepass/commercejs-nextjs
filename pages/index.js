// import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import { commerce } from '../lib/commerce'
import ProductListing from '../components/ProductListing';

export async function getStaticProps() {
  const merchant = await commerce.merchants.about();
  const { data: products } = await commerce.products.list();

  return {
    props: {
      merchant,
      products,
    }
  }
}

const Home = ({ products }) => (
  <div>
    <ProductListing products={products} />
  </div>
);

export default Home;