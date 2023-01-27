import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";

import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [productDetails, setProductDetails] = useState([]);

  const [loading, setLoading] = useState(true);

  const [noproduct, setNoProduct] = useState(false)
  const [value, setValue] = useState("");
  const [first, setFirst] = useState("notfirst");
  const { enqueueSnackbar } = useSnackbar();
  const [allProducts, setallProducts] = useState([]);
  const [items, setItems] = useState([]);

  const [debounceTime, setdebounceTime] = useState(null);

  let m = localStorage.getItem("token") !== null ? 9 : 12;

  //const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    performAPICall();
    localStorage.getItem("token") && fetchCart(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (first !== "notfirst") {
      debounceSearch(value, debounceTime);
    }
  }, [value]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    const url = `${config.endpoint}/products`;

    setFirst("first");

    try {
      const fetchData = await axios.get(url);

      const response = fetchData.data;
      setProductDetails(response);
      setallProducts(response);

      setNoProduct(false);
    } catch (e) {
      setLoading(false);
    }

    setLoading(false);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoading(true);

    let response;

    const url =
      text.length === 0
        ? `${config.endpoint}/products`
        : `${config.endpoint}/products/search?value=${text}`;

    try {
      const fetchData = await axios.get(url);

      response = fetchData.data;

      setProductDetails(response);

      setNoProduct(false);

      setLoading(false);
    } catch (e) {
      setNoProduct(true);
      setProductDetails([]);
      setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTime) {
      clearTimeout(debounceTime);
    }

    const newTime = setTimeout(() => {
      performSearch(event);
    }, 500);
    setdebounceTime(newTime);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    const url = `${config.endpoint}/cart`;

    const headers = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      // TODO: CRIO_TASK_MODsfdsdsLE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const res = await axios.get(url, headers);

      setItems(res.data);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let a = items.filter((e) => e.productId === productId);

    if (a.length > 0) {
      return false;
    }
    return true;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart.", {
        variant: "warning",
      });
      return;
    }

    if (!options || isItemInCart(items, productId)) {
      const url = `${config.endpoint}/cart`;

      const headers = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        // TODO: CRIO_TASK_MODsfdsdsLE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
        const res = await axios.post(
          url,
          { productId: productId, qty: qty },
          headers
        );
        let q = res.data.qty;

        setItems(res.data);
      } catch (e) {
        if (e.response && e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
        return null;
      }
    } else {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          fullWidth
          type="text"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search-box"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          // onChange={(e)=>{debounceSearch(e,500)}}
        />
      </Header>

      {/* Search view for mobiles */}

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        // onChange={(e)=>{debounceSearch(e,500)}}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid container>
          <Grid item className="product-grid" md={m} xs={12}>
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>

            <Grid container spacing={2} className="product_section">
              {loading ? (
                <Grid container direction="column" className="loading">
                  <div>
                    <CircularProgress />
                  </div>
                  <Typography>Loading Products</Typography>
                </Grid>
              ) : !noproduct ? (
                productDetails.map((product) => (
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    spacing={3}
                    sx={{ my: 3 }}
                    key={product._id}
                  >
                    <ProductCard
                      product={product}
                      items={items}
                      allProducts={allProducts}
                      handleAddToCart={addToCart}
                    />
                  </Grid>
                ))
              ) : (
                <Grid container direction="column" className="loading">
                  <div>
                    <SentimentDissatisfied />
                  </div>
                  <Typography>No products found</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
          {localStorage.getItem("token") !== null && (
            <Grid item md={3} xs={12} style={{ backgroundColor: "#E9F5E1" }}>
              <Cart
                products={allProducts}
                items={items}
                handleQuantity={addToCart}
                isReadOnly={false}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
