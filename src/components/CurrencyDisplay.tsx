import { useAppContext } from '../context/AppContext';
import { Currency } from '../types';

interface CurrencyDisplayProps {
  amount: number;
  currency?: Currency;
}

const CurrencyDisplay = ({ amount, currency }: CurrencyDisplayProps) => {
  const { settings, convertCurrency } = useAppContext();
  const displayCurrency = currency || settings.currency;
  const displayAmount = currency ? convertCurrency(amount, currency) : amount;
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: displayCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return <span>{formatter.format(displayAmount)}</span>;
};

export default CurrencyDisplay;
