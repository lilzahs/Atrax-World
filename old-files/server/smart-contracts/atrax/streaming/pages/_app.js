import '../styles/global.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import WalletProviders from '../components/providers/WalletProviders';

export default function MyApp({ Component, pageProps }) {
  return (
    <WalletProviders>
      <Component {...pageProps} />
    </WalletProviders>
  );
}
