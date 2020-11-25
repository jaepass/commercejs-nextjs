import { useRouter } from 'next/router'
import { commerce } from '../../lib/commerce';

// This also gets called at build time, and fetches the product to view
export async function getStaticProps({ params }) {
  const { permalink } = params;
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

  return {
    // Get the paths we want to pre-render based on product
    // We pre-render only these paths at build time
    paths: products.map((product) => ({
      params: {
        permalink: product.permalink,
      },
    })), 
    // { fallback: false } means other routes should 404.
    fallback: true,
  }
}


const ProductDetailPage = ({ product }) => {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div className="product">
    <img className="product__image" src={product.media.source} alt={product.name} />
    <div className="product__info">
      <h4 className="product__name">{product.name}</h4>
      <p className="product__description" dangerouslySetInnerHTML={{__html: product.description}}></p>
      <div className="product__details">
        <p className="product__price">
          {product.price.formatted_with_symbol}
        </p>
        <button
          name="View item"
          className="product__btn"
        >
          View item
        </button>
      </div>
    </div>
  </div> 
  )
}

export default ProductDetailPage;
