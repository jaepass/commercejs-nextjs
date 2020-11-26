import { useRouter } from 'next/router'
import { commerce } from '../../lib/commerce';
import Link from 'next/link';

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps({ params }) {
  const { permalink } = params;
  // Call an external API endpoint to get posts.
  // Retrieve product by permalink
  const product = await commerce.products.retrieve(permalink, {
    type: 'permalink'
  });

  // By returning { props: product }, the Product detail page component
  // will receive `posts` as a prop at build time
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
    // params contains the product's `permalink`.
    // If the route is /product/book,
    // then params.permalink is `book`
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
    <div className="product-detail">
      <img className="product-detail__image" src={product.media.source} alt={product.name} />
      <div className="product-detail__info">
        <Link href="/">
          <a className="product-detail__back">
            <img className="product__icon" src="/icons/arrow-left.svg" />
            <h4>Back to products</h4>
          </a>
        </Link>
        <div className="product-detail__details">
          <h1 className="product-detail__name">{product.name}</h1>
          <h2 className="product-detail__description" dangerouslySetInnerHTML={{__html: product.description}}></h2>
          <h3 className="product-detail__price">
            {product.price.formatted_with_symbol}
          </h3>
          <button
            name="View item"
            className="product-detail__btn"
          >
            Add to cart
          </button>
        </div>
      </div>
  </div> 
  )
}

export default ProductDetailPage;
