export const TelegramService = {
  // Configuración. Debe ser provista por la tienda.
  BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
  CHAT_ID: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',

  async sendOrder(cart, totalAmount, customerWhatsapp) {
    if (!this.BOT_TOKEN || !this.CHAT_ID) {
      console.warn("Telegram no está configurado. Pedido simulado:", { cart, totalAmount, customerWhatsapp });
      return true;
    }

    let message = `🛒 *NUEVO PEDIDO*\n\n`;
    message += `📱 *Cliente WhatsApp:* ${customerWhatsapp}\n\n`;
    message += `🛍️ *Artículos:*\n`;
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (C$${item.price})\n`;
    });

    message += `\n💰 *Total:* C$${totalAmount.toFixed(2)}`;

    const url = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      return response.ok;
    } catch (error) {
      console.error("Error enviando a Telegram:", error);
      return false;
    }
  }
};
