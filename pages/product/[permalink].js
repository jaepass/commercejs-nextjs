import { useRouter } from 'next/router';
import { commerce } from '../../lib/commerce';
import Link from 'next/link';
import ArrowLeft from '../../assets/arrow-left.svg';
import ArrowRight from '../../assets/arrow-right.svg';

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
    // Add head tag
    <div className="product-detail">
      <img className="product-detail__image" src={product.media.source} alt={product.name} />
      <div className="product-detail__info">
        <Link href="/">
          <a className="product-detail__back">
            <ArrowLeft className="product__icon" width={42} height={42} />
            <p>Back to products</p>
          </a>
        </Link>
        <div className="product-detail__details">
          <h1 className="product-detail__name">{product.name}</h1>
          <div
            className="product-detail__description"
            dangerouslySetInnerHTML={{__html: product.description}}
          ></div>
          <div className="product-detail__price">
            {product.price.formatted_with_symbol}
          </div>
        </div>
      </div>
      <button
        name="View item"
        className="product-detail__btn"
      >
      <span>Add to cart</span>
      <ArrowRight className="product__icon" width={48} height={48} />
    </button>
  </div> 
  )
}

export default ProductDetailPage;
