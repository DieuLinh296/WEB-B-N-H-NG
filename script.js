$(document).ready(function() {
    // Dữ liệu sản phẩm
    const products = [
        { id: 1, name: "Python Cơ Bản", price: 150000, category: "Lập trình", icon: "🐍" },
        { id: 2, name: "JavaScript Nâng Cao", price: 200000, category: "Lập trình", icon: "⚡" },
        { id: 3, name: "Rich Dad Poor Dad", price: 120000, category: "Kinh doanh", icon: "💰" },
        { id: 4, name: "The Lean Startup", price: 180000, category: "Kỹ năng", icon: "⚡" },
        { id: 5, name: "Suy Nghĩ Nhanh...", price: 220000, category: "Kinh doanh", icon: "🧠" },
        { id: 6, name: "Dune", price: 250000, category: "Tiểu thuyết", icon: "🏜️" }
    ];

    let cart = [];

    // Render sản phẩm
    function renderProducts() {
        const grid = $('#productGrid');
        grid.empty();
        
        products.forEach(product => {
            const card = `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image">${product.icon}</div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="product-price">${product.price.toLocaleString()}đ</div>
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Thêm giỏ
                        </button>
                    </div>
                </div>
            `;
            grid.append(card);
        });
    }

    // Thêm vào giỏ hàng
    window.addToCart = function(id) {
        const product = products.find(p => p.id === id);
        const cartItem = cart.find(item => item.id === id);
        
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        updateCartUI();
        showNotification('Đã thêm vào giỏ hàng!');
    };

    // Cập nhật UI giỏ hàng
    function updateCartUI() {
        $('.cart-count').text(cart.reduce((sum, item) => sum + item.quantity, 0));
    }

    // Hiển thị thông báo
    function showNotification(message) {
        const notification = $(`
            <div style="
                position: fixed; top: 100px; right: 20px; 
                background: #28a745; color: white; padding: 15px 20px;
                border-radius: 10px; z-index: 3000; font-weight: bold;
                animation: slideInRight 0.5s ease;
            ">
                ${message}
            </div>
        `);
        $('body').append(notification);
        setTimeout(() => notification.fadeOut(500), 2000);
    }

    // Modal giỏ hàng
    $('#cart').click(function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }
        renderCartModal();
        $('#cartModal').fadeIn();
    });

    $('.close').click(function() {
        $('#cartModal').fadeOut();
    });

    $(window).click(function(e) {
        if (e.target.id === 'cartModal') {
            $('#cartModal').fadeOut();
        }
    });

    function renderCartModal() {
        const cartItems = $('#cartItems');
        let total = 0;
        
        cartItems.empty();
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartItems.append(`
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString()}đ x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-total">${itemTotal.toLocaleString()}đ</div>
                    <div class="cart-item-actions">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button onclick="removeFromCart(${item.id})" class="remove-btn">Xóa</button>
                    </div>
                </div>
            `);
        });
        
        $('#cartTotal').text(total.toLocaleString() + 'đ');
    }

    // Cập nhật số lượng
    window.updateQuantity = function(id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            updateCartUI();
            renderCartModal();
        }
    };

    // Xóa khỏi giỏ
    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
        renderCartModal();
    };

    // Scroll to products
    window.scrollToProducts = function() {
        $('html, body').animate({
            scrollTop: $('#products').offset().top - 100
        }, 1000);
    };

    // Mobile menu
    $('.hamburger').click(function() {
        $('.nav-menu').toggleClass('active');
    });

    // Khởi tạo
    renderProducts();
    updateCartUI();

    // Smooth scroll cho dropdown
    $('.dropdown-menu a').click(function(e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        $('html, body').animate({
            scrollTop: target.offset().top - 80
        }, 800);
        $('.nav-menu').removeClass('active');
    });
});

// CSS Animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }
    .cart-item:last-child { border-bottom: none; }
    .cart-item-actions button {
        margin: 0 5px;
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background: #007bff;
        color: white;
    }
    .remove-btn {
        background: #dc3545 !important;
    }
`;
document.head.appendChild(style);