import Image from 'next/image';

export default function Header() {
  return (
    <header>
      <div className="logo">
        <Image 
          src="/assets/FLASHCOIN.png" 
          alt="FLASHCOIN" 
          width={160} 
          height={90}
          priority
        />
        <span>FLASHCOIN</span>
      </div>
    </header>
  );
}
