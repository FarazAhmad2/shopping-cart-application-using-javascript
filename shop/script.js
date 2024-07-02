import {
  colorAndSizeFilter,
  priceFilter,
  ratingFilter,
  tabFilter,
} from "./filters.js";

document.addEventListener("DOMContentLoaded", () => {
  let currUser = JSON.parse(localStorage.getItem("currUser"));

  const sidebarFilter = document.getElementById("sidebar-filter");

  sidebarFilter.addEventListener("click", () => {
    document.querySelector("main aside").classList.toggle("active");
    sidebarFilter.textContent =
      sidebarFilter.textContent == "filters" ? "close" : "filters";
  });

  if (currUser) {
    let colors = ["red", "black", "green", "blue", "white"];
    let sizes = ["S", "M", "L", "XL"];

    if (localStorage.getItem("products")) {
      let prods = JSON.parse(localStorage.getItem("products"));
      console.log("products", prods);
      renderProducts(prods);
      setupFilters(prods);
    } else {
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((data) => {
          let newData = data.map((item) => {
            if (item.category != "jewelery" && item.category != "electronics") {
              item.colors = colors.slice(Math.floor(Math.random() * 4));
              item.sizes = sizes.slice(Math.floor(Math.random() * 4));
            }
            return item;
          });
          localStorage.setItem("products", JSON.stringify(newData));
          console.log("newData", newData);
          renderProducts(newData);
          setupFilters(newData);
        })
        .catch((error) => console.error("Error:", error));
    }

    function displaySection(id, flag = true) {
      const section = document.getElementById(id);
      section.style.display = flag ? "none" : "block";
    }

    function displayClothing(elem, item) {
      item.innerHTML = `
            <img src=${elem.image} alt="Item" />
              <div class="info">
                <div class="row">
                  <div class="title">${elem.title}</div>
                </div>
                <div class="row">
                  <div class="price">$${elem.price}</div>
                  <div class="sized">${elem.sizes}</div>
                </div>
                <div class="colors">
                  Colors:
                  <div class="row">
                    ${elem.colors
                      .map(
                        (color) =>
                          `<div class="circle" style="background-color: ${color}"></div>`
                      )
                      .join("")}
                  </div>
                </div>
                <div class="row">Rating: ${elem.rating.rate}</div>
              </div>
              <button class="addBtn" data-id=${elem.id}>Add to Cart</button>
          `;
      return item;
    }

    function jewelAndElec(elem, item) {
      item.innerHTML = `
          <img src=${elem.image} alt="Item" />
              <div class="info">
                <div class="row">
                  <div class="title">${elem.title}</div>
                </div>
                <div class="row">
                  <div class="price">$${elem.price}</div>
                </div>
                <div class="row">Rating: ${elem.rating.rate}</div>
              </div>
              <button class="addBtn" data-id=${elem.id}>Add to Cart</button>
          `;
      return item;
    }

    function renderProducts(data) {
      const menItems = document.getElementById("men-items");
      const womenItems = document.getElementById("women-items");
      const jewellery = document.getElementById("jewellery");
      const electronics = document.getElementById("electronics");

      menItems.innerHTML = "";
      womenItems.innerHTML = "";
      jewellery.innerHTML = "";
      electronics.innerHTML = "";

      const categoryItems = {
        menSection: new Set(),
        womenSection: new Set(),
        jewellerySection: new Set(),
        electronicsSection: new Set(),
      };

      data.forEach((elem) => {
        const item = document.createElement("div");
        item.classList.add("item");
        if (elem.category == "men's clothing") {
          categoryItems["menSection"].add(elem.category);
          menItems.appendChild(displayClothing(elem, item));
        } else if (elem.category == "women's clothing") {
          categoryItems["womenSection"].add(elem.category);
          womenItems.appendChild(displayClothing(elem, item));
        } else if (elem.category == "jewelery") {
          categoryItems["jewellerySection"].add(elem.category);
          jewellery.appendChild(jewelAndElec(elem, item));
        } else if (elem.category == "electronics") {
          categoryItems["electronicsSection"].add(elem.category);
          electronics.appendChild(jewelAndElec(elem, item));
        }
      });
      let sum = 0;
      for (const key in categoryItems) {
        sum += categoryItems[key].size;
        if (categoryItems[key].size < 1) {
          displaySection(`${key.replace("S", "-s")}`, true);
        } else {
          displaySection(`${key.replace("S", "-s")}`, false);
        }
      }
      let error = document.querySelector(".error");
      error.style.display = sum > 0 ? "none" : "flex";
    }

    function setupFilters(products) {
      const search = document.getElementById("search");
      search.addEventListener("input", () => {
        let searchValue = search.value.trim().toLowerCase();
        let filterData;
        if (searchValue != "") {
          filterData = products.filter(
            (item) =>
              item.category.toLowerCase().includes(searchValue) ||
              item.title.toLowerCase().includes(searchValue)
          );
          renderProducts(filterData);
        }
      });

      tabFilter(products, renderProducts);

      priceFilter(products, renderProducts);

      colorAndSizeFilter(products, renderProducts);

      ratingFilter(products, renderProducts);

      let myCart = JSON.parse(localStorage.getItem("myCart") ?? "{}");
      const addToCart = document.querySelectorAll(".addBtn");
      addToCart.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.dataset.id;
          myCart[productId] = (myCart[productId] ?? 0) + 1;
          localStorage.setItem("myCart", JSON.stringify(myCart));
        });
      });
    }
  } else {
    window.location.href = "/signup/login.html";
  }
});
