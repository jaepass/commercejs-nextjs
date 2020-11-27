import ArrowLeft from '../assets/arrow-left.svg'

const ProductItem = ({ product }) => {
  
    return (
      <div className="product">
        <img
					className="product__image"
					src={product.media.source}
					alt={product.name}
				/>
        <div className="product__info">
          <h2 className="product__name">Shop {product.name}</h2>
					<ArrowLeft className="product__icon" width={48} height={48} />
        </div>
      </div> 
    );
  };
  
  export default ProductItem;