document.addEventListener("DOMContentLoaded", () => {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  if (currUser) {
    let myCart = JSON.parse(localStorage.getItem("myCart") ?? "{}");
    let products = JSON.parse(localStorage.getItem("products"));

    const cartItems = document.getElementById("cart-items");
    const checkoutItems = document.querySelector(".checkout");

    function getProductData(productId) {
      return products.find((item) => item.id == productId);
    }

    function renderCart() {
      cartItems.innerHTML = "";
      let product;
      for (const productId in myCart) {
        product = getProductData(productId);
        for (let i = 0; i < myCart[productId]; i++) {
          const item = document.createElement("div");
          item.classList.add("item");
          item.innerHTML += `
              <img src=${product.image} alt="Item" />
              <div class="info">
                <div class="title">${product.title}</div>
                <div class="row">
                  <div class="price">$${product.price}</div>
                </div>
              </div>
              <button class="removeBtn" data-id=${product.id}>Remove From Cart</button>
                    `;
          cartItems.appendChild(item);
        }
      }
    }

    function renderCheckout() {
      checkoutItems.innerHTML = "";
      let product;
      let sum = 0;
      let isEmpty = true;
      for (const productId in myCart) {
        if (myCart[productId] > 0) {
          isEmpty = false;
        }
        product = getProductData(productId);
        sum += product.price * myCart[productId];
        for (let i = 0; i < myCart[productId]; i++) {
          const row = document.createElement("div");
          row.classList.add("row");
          row.innerHTML = `
                        <p>1. ${product.title}</p>
                        <p>$${product.price}</p>
                `;
          checkoutItems.appendChild(row);
        }
      }

      checkoutItems.innerHTML += `
            <div class="row total">
              <p>Total</p>
              <p>$${sum.toFixed(2)}</p>
            </div>
            `;
      if (!isEmpty) {
        checkoutItems.innerHTML += `<button class="checkoutBtn">Click To Checkout</button>`;
        checkoutItems.addEventListener("click", (e) => {
          if (e.target.matches(".checkoutBtn")) {
            var options = {
              key: "rzp_test_PV1oQ0oMtgXOsq",
              amount: +sum.toFixed(2) * 100,
              currency: "USD",
              name: "MeShop.",
              description: "This is your order",
              theme: {
                color: "#000",
              },
              image:
                "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
            };

            var rzpy1 = new Razorpay(options);
            rzpy1.open();
            e.preventDefault();
            localStorage.removeItem("myCart");
          }
        });
      }
    }

    function removeFromCart() {
      cartItems.addEventListener("click", (event) => {
        // Check if the clicked element is a button
        if (event.target.matches(".removeBtn")) {
          const btn = event.target;
          myCart[btn.dataset.id] -= 1;
          if (myCart[btn.dataset.id] == 0) {
            delete myCart[btn.dataset.id]
          }
          localStorage.setItem("myCart", JSON.stringify(myCart));
          renderCart();
          renderCheckout();
        }
      });
    }

    renderCart();
    renderCheckout();
    removeFromCart();
  } else {
    window.location.href = "/signup/login.html";
  }
});