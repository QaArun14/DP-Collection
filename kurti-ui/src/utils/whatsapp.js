export const STORE_WHATSAPP_NUMBER = '919758999617'; // Durgesh Collection WhatsApp Number

/**
 * Construct direct WhatsApp order link for a single product
 */
export function getProductWhatsAppUrl(product, size = 'M', color = '') {
  const text = `*DURGESH COLLECTION - Order Inquiry*\n\n` +
    `Hello *Durgesh Collection*, I would like to order this Kurti:\n\n` +
    `*Product:* ${product.name}\n` +
    `*Selected Size:* ${size}\n` +
    (color ? `*Color:* ${color}\n` : '') +
    `*Price:* Rs. ${product.price.toLocaleString()} (MRP: Rs. ${product.originalPrice.toLocaleString()})\n` +
    `*Fabric:* ${product.fabric}\n` +
    `*Image:* ${product.primaryImage}\n\n` +
    `Please confirm the order and share delivery details!`;

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Construct direct WhatsApp order link for the entire shopping cart
 */
export function getCartWhatsAppUrl(cartItems, grandTotal, appliedPromo = null) {
  let itemsList = '';
  cartItems.forEach((item, index) => {
    itemsList += `${index + 1}. *${item.name}* (Size: ${item.selectedSize}${item.selectedColor ? `, Color: ${item.selectedColor}` : ''}) x ${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
  });

  const text = `*DURGESH COLLECTION - Shopping Bag Order*\n\n` +
    `Hello *Durgesh Collection*, I want to place an order for the following items:\n\n` +
    `*Order Items:*\n${itemsList}\n` +
    (appliedPromo ? `*Applied Coupon:* ${appliedPromo}\n` : '') +
    `*Grand Total:* Rs. ${grandTotal.toLocaleString()}\n` +
    `*Shipping:* FREE Express Delivery\n\n` +
    `*My Delivery Details:*\n` +
    `Name: \n` +
    `Address: \n` +
    `Pincode: \n` +
    `City: \n\n` +
    `Please confirm my order and share payment link / COD confirmation!`;

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
