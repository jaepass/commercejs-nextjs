Next.js is a full stack framework

Use CLI

With npm use npx which installs the CLI then the run the command

`yarn create next-app`


 
This will install a boilerplate app and all of its dependencies. The project's package.json will have all the needed scripts ready for you as well.

In `package.json`

next Will start Next.js in dev mode with hot reloading.

next build Will build your project and ready it for production.

next start Will start your built app, used in production.

OR

`yarn add react react-dom next`

"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
}

Create a `index.js` in pages and create a simple component

```js
import React from 'react';

const Page = () => <div>Index page</div>

export default Page;
```

Then run `yarn dev` to see a component with the text Index page

Routing is built in with pages. No overhead with having to figure out routing

install @chec/commerce.js

Create .env and add NEXT_PUBLIC_CHEC_PUBLIC_KEY

Create lib/commerce.js

instantiate commerce

```jsx
import { commerce } from '../lib/commerce'

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

const Home = ({ merchant, products }) => (
  <div>
      <h1>Merchant</h1>
      <pre>{JSON.stringify(merchant, null, 2)}</pre>
      <h1>Products</h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
  </div>
);

export default Home;
```

Create ProductsItem component

```jsx
const ProductItem = ({ product }) => {

    // dangerouslySetInnerHTML is React’s replacement for using innerHTML in the browser
    // DOM. In general, setting HTML from code is risky because it’s easy to inadvertently expose
    // your users to a cross-site scripting (XSS) attack. So, you can set HTML directly from React,
    // but you have to type out dangerouslySetInnerHTML and pass an object with a __html
    // key, to remind yourself that it’s dangerous.
    const description = {__html: product.description};
  
    return (
      <div className="product">
        <img className="product__image" src={product.media.source} alt={product.name} />
        <div className="product__info">
          <h4 className="product__name">{product.name}</h4>
          <p className="product__description" dangerouslySetInnerHTML={description}></p>
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
    );
  };
  
  export default ProductItem;
```

Create products list component

```jsx
import Link from 'next/link';
import ProductItem from './ProductItem';

const ProductsList = ({ products }) =>  (
    <div className="products" id="products">
        {products.map((product) => (
            <Link key={product.id} href={`/products/${product.permalink}`}>
              <a>
                <ProductItem
                    product={product}
                />
              </a>
            </Link>
        ))}
    </div>
)

export default ProductsList;
```