import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQty = (item, qty) => {

    if (qty <= 0) {

      dispatch(removeFromCart(item._id))

      return;

    }

    dispatch(addToCart({
      ...item,
      quantity: qty
    }))

  }
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Your Cart is Empty 🛒</h1>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 20,
            padding: "12px 25px",
            background: "linear-gradient(90deg,#4f7df3,#d946ef)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1
        style={{
          marginBottom: 30,
          color: "#333",
        }}
      >
        Shopping Cart
      </h1>

      {cartItems.map((item) => (
        <div
          key={item._id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: 20,
            marginBottom: 20,
            borderRadius: 15,
            boxShadow: "0 3px 12px rgba(0,0,0,.1)",
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 10,
            }}
          />

          <div style={{ flex: 1 }}>
            <h2>{item.name}</h2>

            <p style={{ color: "#666" }}>
              ₹{item.price}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 10,
              }}
            >
              <button
                onClick={() =>
                  handleUpdateQty(item, item.quantity - 1)
                }
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                -
              </button>

              <span
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  handleUpdateQty(item, item.quantity + 1)
                }
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={() => handleRemove(item._id)}
              style={{
                background: "red",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div
        style={{
          textAlign: "right",
          marginTop: 30,
        }}
      >
        <h2>Total : ₹{totalPrice.toFixed(2)}</h2>

        <button
          style={{
            marginTop: 15,
            marginRight: 15,
            padding: "12px 25px",
            background: "#555",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

        <button
          onClick={() => navigate("/checkout")}
          style={{
            padding: "12px 25px",
            background: "linear-gradient(90deg,#4f7df3,#d946ef)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;