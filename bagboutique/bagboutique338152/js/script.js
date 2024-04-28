/* conects html elements to js file*/
document.addEventListener('DOMContentLoaded', function() {
    //creating variables for DOM elements to be used in js file
    const menu = document.querySelector('#menu-icon'); //for menu icons animation
    const navlist = document.querySelector('.navlist'); // for navlist animation
    const cartContainer = document.getElementById('cart-container'); // for cart page to update cart info presented

    
    menu.onclick = () => { //toggles menu icons animation and shows or hides the menu
        menu.classList.toggle('bx-x');
        navlist.classList.toggle('open');
    };

    window.onscroll = () => { // for scrolling animations and mobile navbar
        if (menu.classList.contains('bx-x')) {
            menu.classList.remove('bx-x');
            navlist.classList.remove('open');
        }
    };

    
    document.body.addEventListener('click', function(event) { // for adding and deleting items from cart, allows to handle multiple items.
        if (event.target.classList.contains('add-to-cart-btn')) {
            event.preventDefault();
            const productElement = event.target.closest('.row');
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = parseFloat(productElement.querySelector('.row-right h6').textContent.replace('£', ''));
            const productId = event.target.getAttribute('data-id');
            addProductToCart(productId, productName, productPrice);
        } else if (event.target.classList.contains('delete-btn')) {
            event.preventDefault();
            const productId = event.target.getAttribute('data-id');
            deleteProductFromCart(productId);
        }
    });

    function addProductToCart(productId, productName, productPrice) { // adds product to cart and updates cart info and uses the local storage to store the cart items.
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        let existingItem = cartItems.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ productId, productName, productPrice, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartUI(cartItems);
    }

    function deleteProductFromCart(productId) { // deletes product from cart and updates cart info and uses the local storage to store the cart items.
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems = cartItems.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartUI(cartItems);
    }

    function updateCartUI(cartItems) { // updates cart info on the html file and calculates the total cost.
        let totalAmount = 0;
        cartContainer.innerHTML = '';
        cartItems.forEach(function(item) {
            let productElement = document.createElement('div');
            productElement.innerHTML = `<p><a href="#" class="product-link" data-id="${item.productId}">${item.productName}</a> <span class="price">£${(item.productPrice * item.quantity).toFixed(2)}</span> <button class="delete-btn" data-id="${item.productId}">Delete</button></p>`;
            cartContainer.appendChild(productElement);
            totalAmount += item.productPrice * item.quantity;
        });
        let totalElement = document.getElementById('total-amount');
        totalElement.textContent = `£${totalAmount.toFixed(2)}`;
    }

    let initialCartItems = JSON.parse(localStorage.getItem('cart')) || []; //loads the cart items from local storage and presents on the cart.html even if the page is refreshed..
    updateCartUI(initialCartItems);
});
