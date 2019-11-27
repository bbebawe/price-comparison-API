
var vm = new Vue({
    el: "#app",
    data: {
        data: null,
        categories: null,
        categoryProduct: null,
        displayedCategoryName: null,
        productPrice: null,
        showCategories: true,
        showCategoryProduct: false,
        showProductPrice: false,
        searchCriteria: 'categories',
        searchKeyword: null
    },

    computed: {
        numberOfUniqueProductsInCategory: function () {
            return this.categoryProduct.length;
        },
        numberOfProductsInCategory: function () {
            return this.productPrice.length;
        },


    },
    mounted: function () {
        axios.get('api/categories').then(function (res) {
            vm.categories = res.data;
            console.log("got it");
        });
    },
    methods: {
        getCategoryProducts: function (category_id, category_name) {
            axios.get(`api/categories/${category_id}/products`).then(function (res) {
                vm.categoryProduct = res.data;
                console.log("got it");
                vm.showCategories = false;
                vm.showCategoryProduct = true;
                vm.displayedCategoryName = category_name;
            });
        },
        getProductPriceById: function (product_id) {
            console.log(product_id);
            axios.get(`api/prices/${product_id}`).then(function (res) {
                vm.productPrice = res.data;
                console.log("got it");
                vm.showCategoryProduct = false;
                vm.showCategoryProduct = false;
                vm.showProductPrice = true;
            });
        },
        // search: function() {
        //     if(this.searchKeyword != null) {
        //         if(this.searchCriteria == 'categories') {
        //             axios.get('api/categories').then(function (res) {
        //                 vm.categories = [];
        //                 res.data.forEach(function(category) {
        //                     if(category.category_name.toLowerCase().includes(vm.searchKeyword.toLowerCase())) {
        //                         vm.categories.push(category);
        //                     }
        //                 }); 
        //                 console.log("got it");
        //             });
        //         }
        //     }
        // }
    }
});