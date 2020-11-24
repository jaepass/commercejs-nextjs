import Link from 'next/link';
import ProductItem from './ProductItem';

const ProductsList = ({ products }) =>  (
    <div className="products" id="products">
        {products.map((product) => (
            <Link href={`/product/${product.permalink}`}>
                <a>
                    <ProductItem
                        key={product.id}
                        product={product}
                    />
                </a>
            </Link>
        ))}
    </div>
)

export default ProductsList;