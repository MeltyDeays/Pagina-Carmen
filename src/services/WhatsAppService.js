export const WhatsAppService = {
  // Número de la tienda. Se lee de las variables de entorno.
  STORE_NUMBER: import.meta.env.VITE_STORE_WHATSAPP || '50584012444',

  sendOrder(cart, totalAmount) {
    if (!this.STORE_NUMBER) {
      console.error("WhatsApp no está configurado.");
      return false;
    }

    let message = `📝 *NUEVA COTIZACIÓN*\n\n`;
    message += `🛍️ *Artículos:*\n`;
    
    cart.forEach(item => {
      const sizeInfo = item.size ? ` (Talla: ${item.size})` : '';
      const brandInfo = item.brand ? ` [${item.brand}]` : '';
      message += `- ${item.name}${brandInfo}${sizeInfo} - C$${item.price}\n`;
    });

    message += `\n💰 *Total:* C$${totalAmount.toFixed(2)}\n\n`;
    message += `✨ *Nota:* Hola, me gustaría cotizar estos artículos.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.STORE_NUMBER}?text=${encodedMessage}`;
    
    // Abrir en una nueva pestaña
    window.open(whatsappUrl, '_blank');
    return true;
  }
};
