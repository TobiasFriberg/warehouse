import Products from './../data/products.json';
import Inventory from './../data/inventory.json';

const getRandomDelay = () => Math.floor(Math.random() * Math.floor(1500));

export const fetchProducts = () => {
	return new Promise<{products: any[]}>((resolve) => {
		setTimeout(() => resolve(Products), getRandomDelay()); // Timeout to simulate fetch delay from server
	});
};

export 	const fetchInventory = () => {
	return new Promise<{inventory: any[]}>((resolve, reject) => {
		setTimeout(() => resolve(Inventory), getRandomDelay()); // Timeout to simulate fetch delay from server
	});
};