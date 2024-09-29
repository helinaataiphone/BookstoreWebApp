import React, { useState, useEffect, useContext } from "react";
import NavBar from "../Components/NavBar";
import "./Products.css";
import Grid from "@mui/material/Grid";
import ItemCard from "../Components/ItemCard";
import { UserProvider } from "../Components/UserAdminContext";
import { useParams } from 'react-router-dom';
import {
  useMediaQuery,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddProductDialog from "../Components/AddProductDialog";
import axios from "axios";
import { AuthContext } from "../AuthContext";

const Products = () => {
  let { id } = useParams(); 
  const [category, setCategory] = useState(id||'all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 33;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { isAdmin } = useContext(AuthContext); // Get admin status from context
  const [categories, setCategories] = useState([]); // State to store categories
  const [productsArr, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(false); // Define loading state

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(category); // Fetch products when the category changes
  }, [category]); // Re-run when category changes

  // Fetch products (available or requestable) based on category
  const fetchProducts = async (selectedCategory) => {
    try {
      setLoading(true);
      let response;
      if (isAdmin) {
        // If the user is an admin, fetch all products no matter the category or quantity
        if (selectedCategory === "all") {
          response = await axios.get("http://localhost:8000/api/products/");
        } else {
          response = await axios.get(
            `http://localhost:8000/api/products/category/${selectedCategory}/`
          );
        }
      } else {
        // For non-admin users, fetch only available/requestable products
        if (selectedCategory === "all") {
          response = await axios.get("http://localhost:8000/api/products/");
        } else {
          response = await axios.get(
            `http://localhost:8000/api/products/category/${selectedCategory}/`
          );
        }
      }
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = productsArr.length;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsArr.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAddProduct = () => {
    setIsAddProductOpen(true);
  };

  const handleCloseAddProduct = () => {
    setIsAddProductOpen(false);
  };

  const handleSaveNewProduct = (newProduct) => {
    console.log("New product created:", newProduct);
    setIsAddProductOpen(false);
  };

  const handleAddNewCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]); // Add the new category (name and image)
  };

  const handleDeleteCategories = (categoriesToDelete) => {
    setCategories((prevCategories) =>
      prevCategories.filter(
        (category) => !categoriesToDelete.includes(category.name)
      )
    ); // Remove the selected categories from the list
  };

  return (
    <div>
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>
      <div className="products-page">
        <div className="ProductsHeader">Products</div>

        {isAdmin && (
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenAddProduct}
              startIcon={<AddIcon />}
            >
              Add Product
            </Button>
          </div>
        )}

        <div className="products-container">
          {isMobile ? (
            <div className="category-filter">
              <FormControl fullWidth>
                <InputLabel id="category-label">Filter by Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  value={category}
                  label="Filter by Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="all">All Products</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.categoryname} value={category.categoryname}>
                      {category.categoryname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ) : (
            <div className="sidebar">
              <ul className="category-list">
                <li onClick={() => setCategory("all")}>All Products</li>
                {categories.map((category) => (
                  <li
                    key={category.categoryname}
                    onClick={() => setCategory(category.categoryid)}
                  >
                    {category.categoryname}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="products-content">
            <Grid container spacing={4}>
              {currentProducts.map((product) => (
                <Grid item xs={12} sm={6} md={6} lg={3} key={product.productid}>
                  <ItemCard
                    id={product.productid}
                    title={product.productname}
                    price={product.productprice}
                    image={'/agpeya.png'}
                    quantity={product.availablequantity}
                    isRequestable={product.isrequestable}
                    categoriesList={product.categories}
                    isAdmin={isAdmin}
                  />
                </Grid>
              ))}
            </Grid>

            <Pagination
              currentPage={currentPage}
              totalProducts={totalProducts}
              productsPerPage={productsPerPage}
              paginate={paginate}
            />
          </div>
        </div>
      </div>

      <AddProductDialog
        open={isAddProductOpen}
        handleClose={handleCloseAddProduct}
        handleSave={handleSaveNewProduct}
        categories={categories} // Pass the categories
        handleAddNewCategory={handleAddNewCategory} // Pass the add category function
        handleDeleteCategories={handleDeleteCategories} // Pass the delete category function
      />
    </div>
  );
};

const Pagination = ({
  currentPage,
  productsPerPage,
  totalProducts,
  paginate,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={number === currentPage ? "active" : ""}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Products;
