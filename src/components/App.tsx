import React, { useEffect, useState } from 'react';
import '../styles/main.scss';
import { fetchInventory, fetchProducts } from '../fetch';

import Header from './header';
import Footer from './footer';
import Articles from './articles';
import Card from './card';
import Expander from './expander';
import Loader from './loader';

interface ProductState {
	products: any[];
	isLoaded: boolean;
};

interface InventoryState {
	inventory: any[];
	isLoaded: boolean;
};

const App: React.FunctionComponent = () => {
	const defaultProductState: ProductState = {
		products: [],
		isLoaded: false
	};

	const defaultInventoryState: InventoryState = {
		inventory: [],
		isLoaded: false
	};

	const [ productState, setProductState ] = useState<ProductState>(defaultProductState);
	const [ inventoryState, setInventoryState ] = useState<InventoryState>(defaultInventoryState);

	useEffect(() => {
		fetchProducts().then((response) => {
			setProductState({ products: response.products, isLoaded: true});
		}).catch((e) => {
			setProductState({ products: [], isLoaded: true});
			console.error('could not fetch from api: ', e);
		});

		fetchInventory().then((response) => {
			setInventoryState({ inventory: response.inventory, isLoaded: true});
		}).catch((e) => {
			setInventoryState({ inventory: [], isLoaded: true});
			console.error('could not fetch from api: ', e);
		});
	}, []);

	const isProductAvailable = (product: any) => getQuantityWithCurrentStock(product) > 0;

	const getQuantityWithCurrentStock = (product: any): number => {
		const quantityAvailable = product.contain_articles.flatMap((article: any) => inventoryState.inventory
				.filter(articleInInventory => articleInInventory.art_id === article.art_id)
				.map(articleInInventory => Math.round((parseInt(articleInInventory.stock, 10) / parseInt(article.amount_of, 10)))));

		return Math.min(...quantityAvailable);
	}

	const getNameOfArticle = (articleInProduct: any) => {
		const article = inventoryState.inventory.find(articles => articles.art_id === articleInProduct.art_id);
		const className = parseInt(articleInProduct.amount_of, 10) > parseInt(article.stock, 10) ? 'strike' : '';

		return (
			<div className={className}>
				{articleInProduct.amount_of} {article.name} ({article.stock} in stock)
			</div>
		);
	};

	const renderArticlesForProduct = (articlesFromProduct: any[]) => {
		if (articlesFromProduct.length <= 0) {
			return 'Product does not contain any articles.';
		}

		return articlesFromProduct.map((article, i) => (
				<div className="item" key={i}>
					{getNameOfArticle(article)}
				</div>
			)
		);
	};
	
	const buyProduct = (product: any): void => {
		product.contain_articles.forEach((article: any) => {
			const updatedInventory = inventoryState.inventory.find((articleInInventory) => articleInInventory.art_id === article.art_id);
			updatedInventory.stock = updatedInventory.stock - article.amount_of;
		});

		setInventoryState({...inventoryState});
	};

	const renderSellButton = (product: any) => {
		if (!isProductAvailable(product)) {
			return <span className="notification">Unable to sell more of this item.</span>;
		}

		return (<button className="button" onClick={() => buyProduct(product)}>Sell</button>);
	}

	const renderProducts = () => (
		<div>
			{productState.products.map((product, i) => 
				<Card key={i}>
					<div className="flex space-between">
						<span className="text-headline">{product.name}</span>
						{renderSellButton(product)}
					</div>
					({getQuantityWithCurrentStock(product)} in stock)
					<Expander headline="Articles">
						{renderArticlesForProduct(product.contain_articles)}
					</Expander>
				</Card>
			)}
		</div>
	);

	const renderContent = () => {
		if (!inventoryState.isLoaded || !productState.isLoaded) {
			return (
				<div className="fullscreen">
					<Loader />
				</div>
			);
		}

		return (
			<div>
				<div className="row">
					{renderProducts()}
				</div>
				<div className="row">
					<Articles inventory={inventoryState.inventory} />
				</div>
			</div>
		);
	}

	return (
		<div className="view">
			<Header />
			<div className="content">
				{renderContent()}
			</div>
			<Footer />
		</div>
	);
}

export default App;