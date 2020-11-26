import Link from 'next/link';
import ProductItem from './ProductItem';

const ProductListing = ({ products }) =>  (
    <div className="products" id="products">
        {products.map((product) => (
            <Link href={`/product/${product.permalink}`} key={product.id}>
                <a>
                    <ProductItem
                        product={product}
                    />
                </a>
            </Link>
        ))}
    </div>
)

export default ProductListing;