document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const proceedToPayButton = document.getElementById('proceed-to-pay');
    const addProductsButton = document.getElementById('add-products');
    
    let items = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        items.forEach((item, index) => {
            total += item.price;
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <span>${item.name} - $${item.price.toFixed(2)}</span>
                <span class="remove-item" data-index="${index}">Remove</span>
            `;
            cartItems.appendChild(li);
        });

        cartTotalPrice.textContent = total.toFixed(2);
        localStorage.setItem('cartItems', JSON.stringify(items)); // Save updated cart to local storage
    }
    
    function removeItem(index) {
        items.splice(index, 1);
        updateCart();
    }
    
    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            removeItem(index);
        }
    });

    proceedToPayButton.addEventListener('click', () => {
        window.location.href = 'checkout.html'; // Redirect to the checkout page
    });
    
    addProductsButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirect to the products page
    });

    updateCart(); // Initialize the cart display
});
