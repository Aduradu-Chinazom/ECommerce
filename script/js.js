$(document).ready(function () {
    
let username = localStorage.getItem('Logged_in_user');

    $(document).ready(function(){
        $('.autoplay').slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1, // One slide at a time
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000
        });
    });
       
    let products = [];
    let count = document.getElementById('count');
    let counter = localStorage.getItem(`cart_${username}`) ? parseInt(localStorage.getItem(`cart_${username}`)) : 0;
    count.textContent = counter;

    function getProducts() {
        fetch('https://fakestoreapi.com/products')
            .then((res) => res.json())
            .then((res) => {
                products = res;
                renderProducts(res);
            });
    }

    function renderProducts(products) {
        let container = document.getElementById('container');
        container.innerHTML = '';

        products.forEach((product) => {
            let gridItem = document.createElement('div');
            gridItem.classList.add('grid-items');
            gridItem.innerHTML = `
                <div class="img-case">
                    <img src="${product.image}" alt="" class="item-img">
                </div>
                <h1 class="title">${product.title}</h1>
                <div class="flex">
                    <div>
                        <i class="fa-solid fa-cart-shopping cart" data-id="${product.id}"></i>
                    </div>
                    <div>
                        <h3>$${product.price}</h3>
                    </div>
                </div>
                <p class="title">${product.category}</p>
                <div class="dec">
                    <button class="view_more" data-id="${product.id}">View details</button>
                    <button class="remove" data-id="${product.id}">Remove from Cart</button>
                </div>
            `;

            container.appendChild(gridItem);

            // Disable cart button if product is already in the user's cart
            if (localStorage.getItem(`cartItem_${username}_${product.id}`)) {
                disableAddButton(gridItem.querySelector('.fa-cart-shopping'));
            }
        });

        renderCartItems();
    }

    function renderCartItems() {
        let cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = '';
        let totalCartValue = 0;

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);

            if (key.startsWith(`cartItem_${username}_`)) {
                let productId = key.split('_')[2];
                let product = products.find((p) => p.id == productId);
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

    function disableAddButton(button) {
        button.classList.add('disabled');
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
    }

    $(document).on('click', '.cart', function () {
        let productId = $(this).data('id');

        if (!localStorage.getItem(`cartItem_${username}_${productId}`)) {
            alert('Added to cart');
            counter += 1;
            count.textContent = counter;
            localStorage.setItem(`cart_${username}`, counter);
            localStorage.setItem(`cartItem_${username}_${productId}`, true);
            localStorage.setItem(`cartQuantity_${username}_${productId}`, 1);

            disableAddButton(this);
            renderCartItems();
        }
    });

    $(document).on('click', '.view_more', function () {
        let productId = $(this).data('id');
        window.location.href = `details.html?productId=${productId}`;
    });

    $(document).on('click', '.add', function () {
        let productId = $(this).data('id');
        let quantity = parseInt(localStorage.getItem(`cartQuantity_${username}_${productId}`)) || 1;
        quantity += 1;
        localStorage.setItem(`cartQuantity_${username}_${productId}`, quantity);
        renderCartItems();
    });

    $(document).on('click', '.minus', function () {
        let productId = $(this).data('id');
        let quantity = parseInt(localStorage.getItem(`cartQuantity_${username}_${productId}`)) || 1;
        if (quantity > 1) {
            quantity -= 1;
            localStorage.setItem(`cartQuantity_${username}_${productId}`, quantity);
        }
        renderCartItems();
    });

    $(document).on('click', '.remove', function () {
        let productId = $(this).data('id');

        // Remove item from local storage
        if (localStorage.getItem(`cartItem_${username}_${productId}`)) {
            counter -= 1;
            count.textContent = counter;
            localStorage.setItem(`cart_${username}`, counter);
            localStorage.removeItem(`cartItem_${username}_${productId}`);
            localStorage.removeItem(`cartQuantity_${username}_${productId}`);
            
            // Re-enable the 'add to cart' button for this product
            let addButton = $(`.fa-cart-shopping[data-id="${productId}"]`);
            addButton.removeClass('disabled');
            addButton.css({ opacity: '1', cursor: 'pointer' });

            renderCartItems();
        }
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

    getProducts();
});
