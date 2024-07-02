let activeFilters = {
  colorAndSize: null,
  price: null,
  rating: null,
  tabs: null,
};

function applyFilters(products) {
  let filteredProducts = [...products];
  for (let filter in activeFilters) {
    if (activeFilters[filter]) {
      filteredProducts = activeFilters[filter](filteredProducts);
    }
  }
  return filteredProducts;
}

function getFilteredData(products, checkboxes) {
  if (![...checkboxes].some((checkbox) => checkbox.checked)) {
    return products;
  }

  return products.filter((item) => {
    return Array.from(checkboxes).some((checkbox) => {
      return (
        checkbox.checked &&
        ((item.colors && item.colors.includes(checkbox.value)) ||
          (item.sizes && item.sizes.includes(checkbox.value)))
      );
    });
  });
}

function colorAndSizeFilter(products, renderProducts) {
  const allCheckbox = document.querySelectorAll(".cs-checkbox");
  allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener("click", function () {
      activeFilters.colorAndSize = (products) =>
        getFilteredData(products, allCheckbox);
      const filterData = applyFilters(products);
      renderProducts(filterData);
    });
  });
}

function getPriceRange(checkboxes, products) {
  let min = Infinity;
  let max = -Infinity;
  if (![...checkboxes].some((checkbox) => checkbox.checked)) {
    products.forEach((product) => {
      min = Math.min(min, product.price);
      max = Math.max(max, product.price);
    });
    return { min, max };
  }

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      min = Math.min(min, +checkbox.dataset.min);
      max = Math.max(max, +checkbox.dataset.max);
    }
  });
  return { min, max };
}

function priceFilter(products, renderProducts) {
  const prangeCheckbox = document.querySelectorAll("input[name=prange]");
  prangeCheckbox.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      activeFilters.price = (products) => {
        const { min, max } = getPriceRange(prangeCheckbox, products);
        return products.filter(
          (item) => item.price >= min && item.price <= max
        );
      };
      const filterData = applyFilters(products);
      renderProducts(filterData);
    });
  });
}

function ratingFilter(products, renderProducts) {
  const rating = document.getElementById("range");
  rating.addEventListener("change", () => {
    activeFilters.rating = (products) => {
      return products.filter((item) => item.rating.rate >= +rating.value);
    };
    const filterData = applyFilters(products);
    renderProducts(filterData);
  });
}

function tabFilter(products, renderProducts) {
  const tabs = document.querySelectorAll(".filter");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      tabs.forEach((tab) => tab.classList.remove("active"));

      // Add active class to the clicked tab
      tab.classList.add("active");

      if (tab.dataset.category) {
        activeFilters.tabs = (products) => {
          return products.filter(
            (item) => item.category == tab.dataset.category
          );
        };
      } else {
        // If no category data, remove the tabs filter
        activeFilters.tabs = null;
      }

      const filterData = applyFilters(products);
      renderProducts(filterData);
    });
  });
}

export { colorAndSizeFilter, priceFilter, ratingFilter, tabFilter };
