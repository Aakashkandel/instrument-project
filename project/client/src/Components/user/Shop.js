import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import { Link } from 'react-router-dom';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [hidden, setHidden] = useState(true);
    const [sortOrder, setSortOrder] = useState('default');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/allproductapi');
                setProducts(response.data.products);
                setFilteredProducts(response.data.products);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, selectedCategory, minPrice, maxPrice, products, sortOrder]);

    const filterProducts = () => {
        let filtered = products;

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory && selectedCategory !== 'All Categories') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        if (minPrice) {
            filtered = filtered.filter(product => product.price.regular_price >= minPrice);
        }

        if (maxPrice) {
            filtered = filtered.filter(product => product.price.regular_price <= maxPrice);
        }

        if (sortOrder === 'price-asc') {
            filtered.sort((a, b) => a.price.sales_price - b.price.sales_price);
        } else if (sortOrder === 'price-desc') {
            filtered.sort((a, b) => b.price.sales_price - a.price.sales_price);
        } else if (sortOrder === 'name-asc') {
            filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
        } else if (sortOrder === 'name-desc') {
            filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
        }

        setFilteredProducts(filtered);
    };

    // Pagination Logic
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <div className="bg-white min-h-screen text-gray-800 ml-12">
            <div className="container mx-auto py-8 px-4">
                <div className="text-4xl font-semibold mb-8 text-center text-gray-900">
                    <h2>Shop Products</h2>
                </div>

                <div className='flex justify-between items-center w-10/12 m-auto mb-6'>
                    <form className="flex items-center max-w-sm">
                        <input
                            type="text"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 p-2"
                            placeholder="Search product & category"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </form>
                    <select
                        className="ml-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value)}
                    >
                        <option value="default">Sort By</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentProducts.map((product, index) => (
                        <div key={index} className="bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                            <img
                                src={`http://localhost:5000/${product.image}`}
                                alt={product.product_name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.product_name}</h3>
                                <h4 className="text-gray-600 text-sm mb-4">{product.title}</h4>
                                <div className="flex items-center mb-4">
                                    <span className="text-gray-500 line-through text-sm">Rs {product.price.regular_price}</span>
                                    <span className="text-red-500 font-semibold text-lg ml-2">Rs {product.price.sales_price}</span>
                                </div>
                                <Link to={`../productview/${product._id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out">
                                    Buy Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`mx-1 px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
