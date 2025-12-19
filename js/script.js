document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const clearCartBtn = document.querySelector('.item-delete-btn');
    const productsGrid = document.getElementById('products-grid');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountSpan = document.getElementById('cart-count');
    const searchInput = document.querySelector('.search-bar input');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    
    

    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const name = product.dataset.name.toLowerCase();
            
            if (name.includes(searchValue)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
    

    clearCartBtn.addEventListener('click', () => {
    cart = [];
    saveCart();
    updateCartUI();
});

    let cart = []; // ✅ Continua sendo um array normal

    // 🔹 NOVO — Carrega o carrinho salvo assim que o site abre
    loadCart();

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showMessage('Seu carrinho está vazio! 😔', 'error');
            return;
        }
        
        showMessage('Compra finalizada com sucesso! 🎉', 'sucess'); 
        setTimeout(() => {
            window.location.href = 'sucesso.html';
        }, 1500);
    });

    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productId = Number(productCard.dataset.id);
            const productName = productCard.dataset.name;
            const productPrice = parseFloat(productCard.dataset.price);

            addItemToCart(productId, productName, productPrice);
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
         const cartItem = e.target.closest('.cart-item');
          if (!cartItem) return;
           
          const itemId = Number(cartItem.dataset.id);
            
          if (e.target.classList.contains('increase')) { 
            changeQuantity(itemId, 1);
         }

          if (e.target.classList.contains('decrease')) {
             changeQuantity(itemId, -1);
          } 
          
          if (e.target.classList.contains('remove-item')) {
             removeItem(itemId); 
          } 
        });

    function addItemToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        updateCartUI();

        // 🔹 NOVO — Salva o carrinho sempre que ele muda
        saveCart();

        showMessage(`${name} adicionado ao carrinho 🛒`);
    }

    let toastTimeout;

    function showMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'toast';
        msg.textContent = text;
        
        document.body.appendChild(msg);
        
        toastTimeout = setTimeout(() => msg.remove(), 2000);
    }


    function changeQuantity(id, amount) {
        const item = cart.find(item => item.id === id);
        if (!item) return;
        
        item.quantity += amount;
        
        if (item.quantity <= 0) {
            removeItem(id);
            return;
        }
        
        updateCartUI();
        saveCart();
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);

    updateCartUI();
    saveCart();
}

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
            <p class="empty-cart-msg">
            🛒 Seu carrinho está vazio<br>
            <small>Adicione produtos para continuar</small>
            </p>
            `;
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                totalItems += item.quantity;

                cartItemsContainer.innerHTML += `
                    <div class="cart-item" data-id="${item.id}">
                     <span class="item-name">${item.name}</span>

                     <div class="item-controls">
                        <button class="qty-btn decrease">−</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="qty-btn increase">+</button>
                    </div>

                    <span class="item-price">
                     R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                    
                    <button class="remove-item">🗑️</button>
                    </div>
                `;
            });
        }

        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        cartCountSpan.textContent = totalItems;
    }

    // 🔹 NOVO — Função que SALVA o carrinho no navegador
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        // transforma o array em texto e salva
    }

    // 🔹 NOVO — Função que CARREGA o carrinho salvo
    function loadCart() {
        const storedCart = localStorage.getItem('cart');

        if (storedCart) {
            cart = JSON.parse(storedCart); // transforma texto em array
            updateCartUI(); // atualiza a tela
        }
    }
});