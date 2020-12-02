## Overview

In this workshop you will learn how to create a simple commerce Jamstack application. We will create a product listing page, product detail pages, and add to cart functionality using the Commerce.js SDK and [Next.js](https://nextjs.org/). We will then complete the workshop by deploying the application to [Vercel](https://vercel.com/). Throughout this workshop you will learn how to:

1. Set up a Next.js project
2. Install the Commerce.js SDK
3. Fetch data from the Chec API using Commerce.js
4. Create a product listing page 
5. Create static detail pages and use dynamic routing to the pages
6. Deploy application to Vercel

## Workshop format

In this workshop, we will be focusing our efforts in integrating a commerce layer using the [Chec API](https://commercejs.com/docs/api/) and Commerce.js SDK in a Next.js application. While we will also touch on Next.js concepts and high level of what a Jamstack is, we will stay focused on using Commerce.js.

Setting up a Next.js project is quite seamless but because most configurations have been set up with predefined styles to make this workshop as valuable as possible, you will be cloning a GitHub repository and building from a start branch. Each section has a branch name associated with it so that you can checkout a branch if you'd like to see the next section ie. `git checkout feature/add-plp`.

## Requirements

What you will need to start this project:

- An IDE or code editor
- Node.js >= 10
- npm or yarn
- React devtools (recommended)
- GitHub account
- Vercel account (recommended)

## Prerequisites

This workshop assumes you have some knowledge of the below concepts before starting:

- Basic knowledge of JavaScript
- Some knowledge of React as Next.js is a fullstack framework built on top of React
- An idea of the Jamstack architecture and how APIs work

### Some things to note:

- We will only cover high level concepts of React and Next.js.
- To ensure you have some product data to work with for this workshop, we will provide you with a demo merchant [public key](https://commercejs.com/docs/sdk/concepts#authentication).
- We will not be going over account or dashboard setup. Have a read
  [here](https://commercejs.com/docs/sdk/getting-started#account-setup) if you'd like to learn more about setting up a Chec account.
- This application is using the CSS utility library [TailwindCSS](https://tailwindcss.com/), CSS preprocessor [SASS](https://sass-lang.com/), and [BEM](http://getbem.com/) style naming methology for styling. Because the main goal of this guide is to learn build a Commerce.js and Next.js application, we will not be going over any styling details.

## Initial setup

If you were to build a Next.js project from scratch, the simplest and quickest way to get started with a Next.js project is to run:
[`create next-app`](https://nextjs.org/docs/api-reference/create-next-app) command.

```bash
npx create-next-app
# or
yarn create next-app
```

Alternatively, if you don't want all the boilerplate code included you can run the following command in a new directory:

```bash
npm i react react-dom next
# or
yarn add react react-dom next
```

### 1. Install Commerce.js and add Next.js scripts to the repository

As noted above, let's clone the starter project from this [repository](https://github.com/jaepass/commercejs-nextjs), change directory into the project and install necessary dependencies.

```bash
git clone https://github.com/jaepass/commercejs-nextjs.git
# and
cd commercejs-nextjs && yarn
```

In order to communicate with the Chec API and fetch data from the backend, install the Commerce.js SDK:

```bash
yarn add @chec/commerce.js
# OR
npm install @chec/commerce.js
```
Next, you need to add some scripts to the package.json.

```json
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
}
```

- `next` starts Next.js in dev mode with hot reloading.
- `next` builds your project and ready it for production.
- `next start` starts your built app, used in production.

### 2. Store the public key in an environment variable file

Replace the sample `.env.example` dotenv file at the root of the project to store the Chec public_key.

```
# Copy from source file to destination file .env
cp .env.example .env
```

Open up your the `.env` file and add your Chec public key:

```bash
# Public key from Chec's demo merchant account
NEXT_APP_CHEC_PUBLIC_KEY=pk_184625ed86f36703d7d233bcf6d519a4f9398f20048ec
```

### 3. Create a Commerce.js instance

The Commerce.js SDK comes packed with all the frontend oriented functionality to get a customer-facing web-store up and running. To use the SDK, import the module in a folder called `lib` so you have access to the Commerce object instance throughout your application.

Go ahead and do that right now! In your `src` directory, create a new folder called `lib`, create a file `commerce.js` and copy and paste the below code in it. A lib folder in a project typically stores files that abstracts functions or some form of data.

```js
// src/lib/commerce.js

import Commerce from '@chec/commerce.js';

const checPublicKey = process.env.NEXT_PUBLIC_CHEC_PUBLIC_KEY;
const devEnvironment = process.env.NODE_ENV === 'development';

if (devEnvironment && !checPublicKey) {
  throw Error('A Chec public API key must be provided as an environment variable named NEXT_PUBLIC_CHEC_PUBLIC_KEY. Retrieve your Chec public key in your Chec Dashboard account by navigating to Setup > Developer, or can be obtained with the Chec CLI via with the command chec whoami');
}

export default new Commerce(checPublicKey, devEnvironment);
```

Above, you've imported the `Commerce` object, then exported the instance with your Chec API key provided via an environment variable. The public key is needed to give you access to data via the Chec API.

You might want to throw an error if the public key isn't available, since it will probably make your application unusable.

Now, let's start your dev server.

```bash
yarn dev
# OR
npm dev
```

In this section, you will make your first request to the Chec API using Commerce.js and build out the product listing page.

## Create an index page

First create the directory `/pages` with `index.js` in it and type in the following:

```jsx
const Index = () => <div>Hello</div>

export default Index;
```

Next.js comes with built-in page based and file system routing so any file in the `pages` directory is associated as a route. The file name computes to the route name. We will be creating dynamic routes in the next section but for now let's continue on with getting some data from the Chec API.

## Fetch data from the Chec API

Commerce.js was built with all the frontend functionality needed to build a complete and custom eCommerce store. Simply make requests to various Chec API endpoints, receive successful responses, then use the raw data to output beautifully onto your web store.

Let's start to make requests to fetch data from Chec to list the merchant details and product data. Continuing from `index.js`, you need to first import in the commerce client created in `lib` then use the `getStaticProps` function in Next.js to store fetch and return our props. The two requests we will make are:
- Make a request to the [merchant](https://commercejs.com/docs/sdk/full-sdk-reference#merchants) API endpoint and fetch the merchant's information using the Commerce.js [`merchant.about` method](https://commercejs.com/docs/sdk/full-sdk-reference#merchants). This function returns the merchant object with details such as the name and contact info.
- Make a request to the [products](https://commercejs.com/docs/sdk/products) API endpoint using the Commerce.js [`products.list` method](https://commercejs.com/docs/sdk/products#list-products) to fetch the products data. The request will return an array of product objects with properties such the products' names, prices, and description.

After the request statements, return both  `merchant` and `products` and props. With the props now available, create the Index function, pass in both props and let's just render out the data in JSON to take a look at what gets returned!

```js
import { commerce } from '../lib/commerce'

export async function getStaticProps() {
  const merchant = await commerce.merchants.about();
  const { data: products } = await commerce.products.list();

  return {
    props: {
      merchant,
      products,
    },
  }
}

const Index = ({ merchant, products }) => (
  <div>
    <h1>Merchant</h1>
    <pre>{JSON.stringify(merchant, null, 2)}</pre>
    <h1>Products</h1>
    <pre>{JSON.stringify(products, null, 2)}</pre>
  </div>
);

export default Index;
```

With the product data you will be able to use the various product properties such as `product.name` to render a product item component, which you'll get to building in the next section.

## Create a product item component

The nature of modern frameworks is to separate your code into components.

Components are a way to encapsulate a group of elements for reuse throughout your application. You'll be creating two components for the product listing page, one will be for the single product item and another to render out the list of products.

Start by creating a function component and name it `ProductItem.js` in a new directory `components`. This component will render the
individual product card. Pass in a `product` prop as the parameter. You will reference this property to access each product's image and name via `product.media.source` and `product.name`.

```jsx
import ArrowRight from '../assets/arrow-right.svg';

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
				<ArrowRight className="product__icon" width={48} height={48} />
			</div>
		</div> 
	);
};

export default ProductItem;
```

With our `ProductItem` component, let's now get to creating a product listing component to render out a list of the product item cards in the next section.

## Create a product listing page

It's now time to create a `ProductsList.js` component inside `/components`. The `ProductsList` component will be function component which will loop through and render a list of `ProductItem` components.

First, import the `next/link` module and the `ProductItem` component. Next, define a `products` prop. This will be provided by the parent component. You need to then use map through the products data array to render a `ProductItem` component for each product in your `products` prop. When a looping method is used to render out an array list, a unique identifier needs to be used (`product.id`) as the `key` attribute in the `Link` component - React will use it to determine which items in a list have changed and which parts of your application need to be re-rendered. The `Link` component wraps around each `ProductItem` to navigate to a single product detail page using the `permalink` property, you will be building this page view in the next section.

```js
import Link from 'next/link';
import ProductItem from './ProductItem';

const ProductListing = ({ products }) => (
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
);

export default ProductListing;
```

## Render the product listing page

With both your product item and list components created, let's get back to your `Index.js` to render the `<ProductListing />` and pass in the `products` prop with the returned product data as the value.

```jsx
import { commerce } from '../lib/commerce'
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductListing from '../components/ProductListing';

export async function getStaticProps() {
  const merchant = await commerce.merchants.about();
  const { data: products } = await commerce.products.list();

  return {
    props: {
      merchant,
      products,
    },
  }
}

const Index = ({ merchant, products }) => (
  <div>
    <Header merchant={merchant}/>
    <Hero />
    <ProductListing products={products} />
  </div>
);

export default Index;
```

In this section, you will get to creating a single product detail page.

## Create dynamic routes with `getStaticPaths`

First, view the index page in the browser and click one of the product items, you will notice that you are navigated to a 404 page. Next.js is automatically doing that for us if we try to route to a page that does not exist. Now let's fix that and create some dynamic routes and static pages.

As you notice in our product listing, we are using `next/link` to handle client-side navigation to the dynamic routes we will create. Commerce.js allows us to work with various properties in the products endpoint such as the description and other meta data so we will be using some of the properties to output in a dynamically routed page. Now create a file named [permalink].js in a new `product/` directory - `pages/product/[permalink].js. The variable inside the square brackets will evaluate to each product detail page's permalink. The `permalink` property is being pulled from the Chec API's product data `product.permalink`.

In this component, there are a few moving parts we will create that will come together:
- A function called [`getStaticPaths`](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation) from Next.js that will pre-render paths based on the parameter passed in
- The [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) which you have already used earlier to retrieve a single product with the parameter `permalink`
- The markup for the product detail page

Following the code snippet below code snippet, export the function `getStaticPaths`, then make a call to the [Chec API products endpoint](https://commercejs.com/docs/sdk/products) so that we can map through the products list and return all the `paths` with `product.permalink`. You need to also provide the required `fallback` key to the value `false`. Setting the value to `false` will tell Next.js to render 404 pages when paths don't exist.

```js
import { commerce } from '../../lib/commerce';
import Link from 'next/link';
import ArrowLeft from '../../assets/arrow-left.svg';
import ArrowRight from '../../assets/arrow-right.svg';

// This function gets called at build time on server-side.
export async function getStaticPaths() {
  const { data: products } = await commerce.products.list();

  return {
    paths: products.map((product) => ({
      params: {
        permalink: product.permalink,
      },
    })), 
    fallback: false,
  }
}
export default ProductDetailPage;
```

## Get single product with `getStaticProps`

Next, export the function `getStaticProps` then pass in the required context `params` key. The `params` key has the route parameter that will evaluate to `permalink: { ... }` as that is the property used to define our routes. Note that the variable inside the square brackets would match this property. Let's also destructure `permalink` out of `params` and use it to pass in as a parameter to the [`commerce.products.retrieve`](https://commercejs.com/docs/sdk/products#retrieve-product) Commerce.js function. Either a `product.id` or `product.description` is required to retrieve the product from the Chec API. You will also need to define the type as a second argument. Lastly, return the product as props and the key `revalidate`. This optional key in Next.js define the number of seconds before a static page will get re-generated again. It is using the new feature [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) which has the benefits that emulates SSR but statically re-generates existing pages when there are updates or adds a new page.

```js
// This function gets called at build time on server-side.
export async function getStaticPaths() {
  const { data: products } = await commerce.products.list();

  return {
    paths: products.map((product) => ({
      params: {
        permalink: product.permalink,
      },
    })), 
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { permalink } = params;

  const product = await commerce.products.retrieve(permalink, {
    // Must include a type value
    type: 'permalink'
  });

  return {
    props: {
      product,
    },

    revalidate: 60,
  }
}
export default ProductDetailPage;
```

## Create the product detail template

The last bit of this component is to now render the product detail page with all the returned data you get from the functions above.

Below the function `getStaticProps`, start by creating a function component and name it `ProductDetailPage`. Pass in the `product` parameter which you will use to access each product's image, name, description, and price via `product.media.source`, `product.name`, `product.description` and `price`.

In Chec, product descriptions return HTML which means if we were to render out product.description, we would get a string that returns the html tags along with the description. In general, setting HTML from code is risky because it’s easy to inadvertently expose your users to a cross-site scripting (XSS) attack. You can set HTML directly from React, but you have to type out dangerouslySetInnerHTML and pass an object with a `__html` key, to remind yourself that it might be dangerous. But because we know we can trust the API responses, this is the best approach to take to render out our product description.

```js
const ProductDetailPage = ({ product }) => {

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
```

If you have your server running you should now see the complete application with a product listing page and dynamically routed product detail pages!

## Customization and extendability

The fun does not end here with the Chec API and Commerce.js. You can continue to extend the application to include cart functionalities and a custom checkout flow. Some other enhancements to consider:

- Adding shipping zones and enable shipping options for each product in your dashboard
- Customizing the styling
- Leveraging webhooks to automate post checkout actions