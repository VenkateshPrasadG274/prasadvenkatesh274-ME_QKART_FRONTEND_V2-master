import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added tocart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  let arr = [];
  arr = productsData.filter((e) => {
    for (let i of cartData) {
      if (e._id === i.productId) {
        return true;
      }
    }
  });
  let n = [];
  for (let i of cartData) {
    for (let j of arr) {
      if (i.productId === j._id) {
        n.push(j);
      }
    }
  }

  n.map((e, i) => (e.qty = cartData[i].qty));

  return n;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let total = 0;
  for (let i of items) {
    let cost = i.cost;
    let qty = i.qty;
    total += cost * qty;
  }

  return total;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  return items.length;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
// const ItemQuantity = ({value,handleQuantity,items,id,products}) => {

// let token =localStorage.getItem('token')
// const handleAdd = ()=>{

//  console.log(id)
//   handleQuantity(token,items,products,id,value+1,false)

// }
// const handleDelete =()=>{
//   handleQuantity(token,items,products,id,value-1,false)
// }

//   return (
//     <Stack direction="row" alignItems="center">
//       <IconButton size="small" color="primary" onClick={handleDelete}>
//         <RemoveOutlined />
//       </IconButton>
//       <Box padding="0.5rem" data-testid="item-qty">
//         {value}
//       </Box>
//       <IconButton size="small" color="primary" onClick={handleAdd}>
//         <AddOutlined />
//       </IconButton>
//     </Stack>
//   );

// }
/*
  
   * @param {Boolean} isReadOnly
   *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
   * 
   */
const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  if (isReadOnly) {
    return (
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
          <Box fontWeight="700">Qty: {value}</Box>
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  }
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  const history = useHistory();

  let newItems;
  if (isReadOnly) {
    newItems = items;
  } else {
    newItems = generateCartItemsFrom(items, products);
  }

  let token = localStorage.getItem("token");

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {newItems.map((product) => (
          <Box
            display="flex"
            alignItems="flex-start"
            padding="1rem"
            key={product._id}
          >
            <Box className="image-container">
              <img
                // Add product image
                src={product.image}
                // Add product name as alt eext
                alt=""
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{product.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity
                  // Add required props by checking implementation
                  //  value ={product.qty} products={products} handleQuantity={handleQuantity} items={items} id={product._id}
                  handleAdd={() => {
                    handleQuantity(
                      token,
                      items,
                      products,
                      product._id,
                      product.qty + 1,
                      false
                    );
                  }}
                  handleDelete={() => {
                    handleQuantity(
                      token,
                      items,
                      products,
                      product._id,
                      product.qty - 1,
                      false
                    );
                  }}
                  value={product.qty}
                  isReadOnly={isReadOnly}
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${product.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(newItems)}
          </Box>
        </Box>

        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={(e) => {
                history.push("/checkout");
              }}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Cart;
