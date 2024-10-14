$(document).ready(function () {
    // Get the logged-in user's username
    let username = localStorage.getItem('Logged_in_user');

    // Initialize products array and cart count
    let products = [];
    let count = document.getElementById('count');
    let counter = localStorage.getItem(`cart_${username}`) ? parseInt(localStorage.getItem(`cart_${username}`)) : 0;
    count.textContent = counter;

    // Fetch the product list and store it in the 'products' array
    function fetchProducts() {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(data => {
                products = data;
                renderCartItems(); // Render the cart items after fetching products
            })
            .catch(error => console.error('Error fetching products:', error));
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

                if (product) { // Ensure the product exists before using its properties
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
        }

        // Display total cart value
        document.querySelector('.total h3').textContent = `$${totalCartValue.toFixed(2)}`;
    }

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


    $('#showCart').click(function () {
        $('#cartPanel').addClass('active');
        $('#overlay').addClass('block');
    });

    $('#closeCart, #overlay').click(function (e) {
        if (e.target.id === 'overlay' || e.target.id === 'closeCart') {
            $('#cartPanel').removeClass('active');
            $('#overlay').removeClass('block');
        }
    });
    // Fetch products on page load
    fetchProducts();


});
