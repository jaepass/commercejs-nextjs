const ProductItem = ({ product }) => {
  
    return (
      <div className="product">
        <img className="product__image" src={product.media.source} alt={product.name} />
        <div className="product__info">
          <h2 className="product__name">Shop {product.name}</h2>
					<img className="product__icon" src="/icons/arrow-right.svg" />
        </div>
      </div> 
    );
  };
  
  export default ProductItem;