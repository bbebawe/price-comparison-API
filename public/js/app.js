var vm = new Vue({
    el: "#app",
    data: {
        userSearched: false,
        displayCategories: true,
        displayCategoryProducts: false,
        displayProductPrice: false,
        displayProducts: false,
        displayProductPrices: false,

        categories: null,
        categoryProducts: null,
        displayedCategoryName: null,
        productPrice: null,
        searchCriteria: 'categories',
        searchKeyword: null,
        fetchError: null,
        numberOfCategories: null,
        categoriesPages: [],
        pricesPages: [],
        numberOfCategoriesPages: 0,
        currentCategoryPage: 0,
        numberOfPrices: null,
        numberOfPricesPages: 0,
        currentPricePage: 0,
        currentProductPriceId: null
    },

    computed: {
        numberOfUniqueProductsInCategory: function () {
            return this.categoryProducts.length;
        },
        numberOfProductsInCategory: function () {
            return this.productPrice.length;
        },


    },
    mounted: function () {
        axios.get('api/categories?num_items=4&offset=0').then(function (res) {
            vm.userSearched = false;
            vm.displayCategories = true;
            vm.displayCategoryProducts = false;
            vm.displayProductPrice = false;
            vm.categories = res.data.result;
            vm.numberOfCategories = res.data.numberOfItems;
            vm.numberOfCategoriesPages = Math.ceil(vm.numberOfCategories / 4);
            vm.currentCategoryPage = 0;
            vm.categoriesPages = [];
            for (var i = 0; i < vm.numberOfCategoriesPages; i++) {
                vm.categoriesPages.push(i);
            }
            vm.fetchError = null;
        });
    },
    methods: {
        getCategoryProducts: function (category_id, category_name) {
            axios.get(`api/categories/${category_id}/products`).then(function (res) {
                vm.userSearched = false;
                vm.displayCategories = false;
                vm.displayCategoryProducts = true;
                vm.displayProductPrice = false;
                vm.categoryProducts = res.data;
                console.log(vm.categoryProducts);
                vm.displayedCategoryName = category_name;
            });
        },
        getProductPriceSetById: function (product_id) {
            axios.get(`api/prices/${product_id}?num_items=4&offset=0`).then(function (res) {
                vm.userSearched = false;
                vm.displayCategories = false;
                vm.displayCategoryProducts = false;
                vm.displayProductPrice = true;
                vm.productPrice = res.data.result;
                vm.numberOfPrices = res.data.numberOfItems;
                vm.currentProductPriceId = product_id;
                vm.numberOfPricesPages = Math.ceil(vm.numberOfPrices / 4);
                vm.currentPricePage = 0;
                vm.pricesPages = [];
                console.log(vm.numberOfPricesPages);
                for (var i = 0; i < vm.numberOfPricesPages; i++) {
                    vm.pricesPages.push(i);
                }
                vm.fetchError = null;
            });
        },
        search: function () {
            if (this.searchKeyword != null) {
                vm.fetchError = null;
                if (this.searchCriteria == 'categories') {
                    vm.userSearched = true;
                    vm.displayCategories = true;
                    vm.displayProducts = false;
                    vm.displayProductPrices = false;
                    axios.get(`api/categories?searchTerm=${vm.searchKeyword}`).then((response) => {
                            vm.categories = response.data;
                            console.log(response.data);
                        })
                        .catch((error) => {
                            vm.fetchError = error.response.data.message;
                            // console.log(error.response.dat.message);
                        });
                    console.log("categories");
                }

                if (this.searchCriteria == 'products') {
                    vm.userSearched = true;
                    vm.displayCategories = false;
                    vm.displayProducts = true;
                    vm.displayProductPrices = false;
                    axios.get(`api/products?searchTerm=${vm.searchKeyword}`).then((response) => {
                            vm.categoryProducts = response.data;
                        })
                        .catch((error, response) => {
                            vm.fetchError = "No products Found, Please try different Search";
                            console.log(response.message);
                            console.log(vm.fetchError);
                        });
                    console.log("products");
                }
            }
        },
        nextCategorySet: function () {
            var offset = 4 * (vm.currentCategoryPage + 1);
            vm.currentCategoryPage = vm.currentCategoryPage + 1;
            axios.get(`api/categories?num_items=4&offset=${offset}`).then(function (res) {
                vm.categoriesPages = [];
                vm.categories = res.data.result;
                vm.numberOfCategories = res.data.numberOfItems;
                vm.numberOfCategoriesPages = Math.ceil(res.data.numberOfItems / 4);
                for (var i = 0; i < vm.numberOfCategoriesPages; i++) {
                    vm.categoriesPages.push(i);
                }
                console.log(vm.categoriesPages.length);
                vm.fetchError = null;
            });
        },
        prevCategorySet: function () {
            var offset = 4 * (vm.currentCategoryPage - 1);
            vm.currentCategoryPage = vm.currentCategoryPage - 1;
            axios.get(`api/categories?num_items=4&offset=${offset}`).then(function (res) {
                vm.categoriesPages = [];
                vm.categories = res.data.result;
                vm.numberOfCategories = res.data.numberOfItems;
                vm.numberOfCategoriesPages = Math.ceil(res.data.numberOfItems / 4);
                for (var i = 0; i < vm.numberOfCategoriesPages; i++) {
                    vm.categoriesPages.push(i);
                }
                console.log(vm.categoriesPages.length);
                vm.fetchError = null;
            });
        },
        getCategorySet: function (index) {
            var offset = 4 * index;
            vm.currentCategoryPage = index;
            axios.get(`api/categories?num_items=4&offset=${offset}`).then(function (res) {
                vm.categoriesPages = [];
                vm.categories = res.data.result;
                vm.numberOfCategories = res.data.numberOfItems;
                vm.numberOfCategoriesPages = Math.ceil(vm.numberOfCategories / 4);
                for (var i = 0; i < vm.numberOfCategoriesPages; i++) {
                    vm.categoriesPages.push(i);
                }
                console.log(vm.categoriesPages.length);
                vm.fetchError = null;
            });
        },
        nextPriceSet: function () {
            var offset = 4 * (vm.currentPricePage + 1);
            vm.currentPricePage = vm.currentPricePage + 1;
            var id = vm.currentProductPriceId;
            axios.get(`api/prices/${id}?num_items=4&offset=${offset}`).then(function (res) {
                vm.pricesPages = [];
                vm.productPrice = res.data.result;
                vm.numberOfPrices = res.data.numberOfItems;
                vm.numberOfPricesPages = Math.ceil(vm.numberOfPrices / 4);
                for (var i = 0; i < vm.numberOfPricesPages; i++) {
                    vm.pricesPages.push(i);
                }
                console.log(vm.pricesPages.length);
                vm.fetchError = null;
            });
        },
        prevPriceSet: function () {
            var offset = 4 * (vm.currentPricePage - 1);
            vm.currentPricePage = vm.currentPricePage - 1;
            var id = vm.currentProductPriceId;
            axios.get(`api/prices/${id}?num_items=4&offset=${offset}`).then(function (res) {
                vm.pricesPages = [];
                vm.productPrice = res.data.result;
                vm.numberOfPrices = res.data.numberOfItems;
                vm.numberOfPricesPages = Math.ceil(vm.numberOfPrices / 4);
                for (var i = 0; i < vm.numberOfPricesPages; i++) {
                    vm.pricesPages.push(i);
                }
                console.log(vm.pricesPages.length);
                vm.fetchError = null;
            });
        },
        getPriceSet: function (index) {
            var offset = 4 * index;
            vm.currentPricePage = index;
            var id = vm.currentProductPriceId;
            axios.get(`api/prices/${id}?num_items=4&offset=${offset}`).then(function (res) {
                vm.pricesPages = [];
                vm.productPrice = res.data.result;
                vm.numberOfPrices = res.data.numberOfItems;
                vm.numberOfPricesPages = Math.ceil(vm.numberOfPrices / 4);
                for (var i = 0; i < vm.numberOfPricesPages; i++) {
                    vm.pricesPages.push(i);
                }
                console.log(vm.pricesPages.length);
                vm.fetchError = null;
            });
        }, 
        getSearchCategoryProducts: function(category_id, category_name) {
            axios.get(`api/categories/${category_id}/products`).then(function (res) {
                vm.userSearched = true;
                vm.displayCategories = false;
                vm.displayProducts = true;
                vm.displayProductPrice = false;
                vm.categoryProducts = res.data;
                console.log(vm.categoryProducts);
                vm.displayedCategoryName = category_name;
            });
        }, 
        getSearchProductPriceSetById: function(product_id) {
            axios.get(`api/prices/${product_id}?num_items=4&offset=0`).then(function (res) {
                vm.userSearched = true;
                vm.displayCategories = false;
                vm.displayProducts = false;
                vm.displayProductPrices = true;
                vm.productPrice = res.data.result;
                vm.numberOfPrices = res.data.numberOfItems;
                vm.currentProductPriceId = product_id;
                vm.numberOfPricesPages = Math.ceil(vm.numberOfPrices / 4);
                vm.currentPricePage = 0;
                vm.pricesPages = [];
                console.log(vm.numberOfPricesPages);
                for (var i = 0; i < vm.numberOfPricesPages; i++) {
                    vm.pricesPages.push(i);
                }
                vm.fetchError = null;
            });
        }
    }
});