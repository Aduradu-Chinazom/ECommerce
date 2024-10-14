$(document).ready(function () {
    // Get the logged-in user's username
    let username = localStorage.getItem('Logged_in_user');

    // Initialize products array and cart count
    let products = [];
    let count = document.getElementById('count');
    let counter = localStorage.getItem(`cart_${username}`) ? parseInt(localStorage.getItem(`cart_${username}`)) : 0;
    count.textContent = counter;

    // Function to get productId from URL parameters
    function getSingleProduct(param) {
        let urlParam = new URLSearchParams(window.location.search);
        return urlParam.get(param);
    }

    let productId = getSingleProduct('productId');

    // Fetch the product list only once and store it in the 'products' array
    function getProducts() {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(res => {
                products = res;
                if (productId) {
                    renderSingleProduct(productId);
                }
            });
    }

    // Render a single product's details on the product page
    function renderSingleProduct(productId) {
        let product = products.find(p => p.id == productId);
        if (product) {
            document.getElementById('image').src = product.image;
            document.getElementById('title').textContent = product.title;
            document.getElementById('cat').textContent = product.category;
            document.getElementById('dec').textContent = product.description;
            document.getElementById('price').textContent = `$${product.price}`;

            // Disable "Add to Cart" button if the product is already in the user's cart
            if (localStorage.getItem(`cartItem_${username}_${productId}`)) {
                disableAddButton();
            }
        }
    }

    // Function to disable the "Add to Cart" button
    function disableAddButton() {
        let add = document.getElementById('add');
        add.textContent = "Added to cart";
        add.setAttribute('disabled', 'true');
        add.classList.add('disabled');
        add.style.opacity = '0.5';
        add.style.cursor = 'not-allowed';
    }

    // Render cart items from local storage, specific to the logged-in user
    function renderCartItems() {
        let cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = '';
        let totalCartValue = 0;

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);

            // Only fetch items related to the current user
            if (key.startsWith(`cartItem_${username}_`)) {
                let productId = key.split('_')[2];
                let product = products.find(p => p.id == productId);
                let quantity = parseInt(localStorage.getItem(`cartQuantity_${username}_${productId}`)) || 1;

                let cartItemPrice = (product.price * quantity).toFixed(2);
                totalCartValue += product.price * quantity;

                let cartItem = document.createElement('div');
                cartItem.classList.add('mainCart');
                cartItem.innerHTML = `
                    <div class="content" id="content">
                        <div class="flex-cart">
                            <img src="${product.image}" alt="" class="img-holder">
                            <div class="cart-details">
                                <div>
                                    <span>${product.category}</span>
                                    <div class="flex-cart btn">
                                        <button class="minus" data-id="${productId}">-</button>
                                        <p>Qty: <span>${quantity}</span></p>
                                        <button class="add" data-id="${productId}">+</button>
                                    </div>
                                    <span>$${cartItemPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            }
        }

        // Display total cart value
        document.querySelector('.total h3').textContent = `$${totalCartValue.toFixed(2)}`;
    }

    // Show the cart panel and render items
    $('#showCart').click(function () {
        $('#cartPanel').addClass('active');
        $('#overlay').addClass('block');
        renderCartItems();
    });

    // Close the cart panel
    $('#closeCart, #overlay').click(function (e) {
        if (e.target.id === 'overlay' || e.target.id === 'closeCart') {
            $('#cartPanel').removeClass('active');
            $('#overlay').removeClass('block');
        }
    });

    // Add product to the cart, specific to the logged-in user
    document.getElementById('add').addEventListener('click', function () {
        if (!localStorage.getItem(`cartItem_${username}_${productId}`)) {
            alert("Added to cart");
            counter += 1;
            document.getElementById('count').textContent = counter;
            localStorage.setItem(`cart_${username}`, counter);
            localStorage.setItem(`cartItem_${username}_${productId}`, true);
            localStorage.setItem(`cartQuantity_${username}_${productId}`, 1);
            disableAddButton();
            renderCartItems();
        }
    });

    // Handle cart quantity increases, specific to the logged-in user
    $(document).on('click', '.add', function () {
        let productId = $(this).data('id');
        let quantity = parseInt(localStorage.getItem(`cartQuantity_${username}_${productId}`)) || 1;
        quantity += 1;
        localStorage.setItem(`cartQuantity_${username}_${productId}`, quantity);
        renderCartItems();
    });

    // Handle cart quantity decreases, specific to the logged-in user
    $(document).on('click', '.minus', function () {
        let productId = $(this).data('id');
        let quantity = parseInt(localStorage.getItem(`cartQuantity_${username}_${productId}`)) || 1;
        if (quantity > 1) {
            quantity -= 1;
            localStorage.setItem(`cartQuantity_${username}_${productId}`, quantity);
        }
        renderCartItems();
    });

    // Fetch products on page load
    getProducts();
});
