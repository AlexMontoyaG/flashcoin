'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode.react';
import { WALLET_ADDRESS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface WalletInfoProps {
  amount: number;
  onHome: () => void;
  formData?: {
    fullName: string;
    email: string;
    phone: string;
    document: string;
    accountType?: string;
    accountNumber?: string;
  };
  selectedBank: string;
  wldAmount: string;
}

export default function WalletInfo({ amount, onHome, formData, selectedBank, wldAmount }: WalletInfoProps) {
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      const button = document.getElementById('copyAddress');
      if (button) {
        button.textContent = '¡Copiado!';
        setTimeout(() => {
          button.textContent = 'Copiar';
        }, 2000);
      }
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleWhatsAppClick = () => {
    const message = `¡Hola! Quiero realizar un intercambio de WorldCoin:

Nombre: ${formData?.fullName || ''}
Email: ${formData?.email || ''}
Teléfono: ${formData?.phone || ''}
Documento: ${formData?.document || ''}
Banco: ${selectedBank}${formData?.accountType ? `\nTipo de cuenta: ${formData.accountType}` : ''}${formData?.accountNumber ? `\nNúmero de cuenta: ${formData.accountNumber}` : ''}
Cantidad WLD: ${wldAmount}
Total a recibir: ${formatCurrency(amount)}`;

    const whatsappUrl = `https://wa.me/+573222222222?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="wallet-container">
      <h3>Escanea el QR para envíar WLD a esta dirección</h3>
      <div className="qr-container">
        <QRCode 
          value={WALLET_ADDRESS}
          size={200}
          level="H"
        />
      </div>
      <div><h3>ó</h3></div>
      <br />
      <div><h3>Copia la dirección de la wallet</h3></div>
      <div className="wallet-address">
        <p id="walletAddress">{WALLET_ADDRESS}</p>
        <button id="copyAddress" className="copy-btn" onClick={handleCopyAddress}>
          Copiar
        </button>
      </div>
      <div className="summary">
        <h4>Total a recibir:</h4>
        <p id="finalAmount" className="amount">
          {formatCurrency(amount)}
        </p>
      </div>
      <p className="whatsapp-message">
        Después de enviar los Worldcoin, porfavor escribir al WhatsApp para finalizar la venta con uno de nuestros asesores
      </p>
      
      <div className="button-group">
        <button className="home-btn" onClick={onHome}>
          IR AL INICIO
        </button>
        <button className="whatsapp-btn" onClick={handleWhatsAppClick}>
          <i className="fab fa-whatsapp"></i>
          WhatsApp
        </button>
      </div>
    </div>
  );
}
