import commerce from '../../lib/commerce';

// This also gets called at build time, and fetches the product to view
export async function getStaticProps({ params: { permalink } }) {
  // params contains the product's `permalink`.
  // If the route is /product/book,
  // then params.permalink is `book`
  // Retrieve product by permalink
  const product = await commerce.products.retrieve(permalink, {
    type: 'permalink'
  });

  // Pass product data to the page via props
  return {
    props: {
      product,
    }
  }
}

export async function getStaticPaths() {
  const { data: products } = await commerce.products.list();

  // Get the paths we want to pre-render based on product
  const paths = products.map((product) => ({
    params: {
      permalink: product.permalink,
    },
  })),

  return {
    // We'll pre-render only these paths at build time.
    paths,
    // { fallback: false } means other routes should 404.
    fallback: true,
  }
}

const ProductDetailPage = ({ product }) => {
  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <p dangerouslySetInnerHTML={{__html: product.description}}></p>
      <p>{product.price.formatted_with_symbol}</p>
    </div>
  )
}

export default ProductDetailPage;
