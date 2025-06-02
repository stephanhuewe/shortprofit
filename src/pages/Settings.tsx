import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AppSettings, Currency } from '../types';

const Settings = () => {
  const { settings, updateSettings } = useAppContext();
  
  const [formData, setFormData] = useState<AppSettings>({
    ...settings,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let newValue: string | number = value;
    if (name === 'exchangeRate' || name === 'defaultTaxRate' || name === 'defaultChannelFeePercentage' || name === 'defaultCleaningFee') {
      newValue = parseFloat(value) || 0;
    }
    
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };
  
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value as Currency;
    setFormData({
      ...formData,
      currency: newCurrency,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your application preferences.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Currency Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currency" className="label">Default Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleCurrencyChange}
                className="input"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="exchangeRate" className="label">Exchange Rate (USD to EUR)</label>
              <input
                type="number"
                id="exchangeRate"
                name="exchangeRate"
                value={formData.exchangeRate}
                onChange={handleInputChange}
                className="input"
                min="0.01"
                step="0.01"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                1 USD = {formData.exchangeRate} EUR
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Default Values</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="defaultTaxRate" className="label">Default Tax Rate (%)</label>
              <input
                type="number"
                id="defaultTaxRate"
                name="defaultTaxRate"
                value={formData.defaultTaxRate}
                onChange={handleInputChange}
                className="input"
                min="0"
                step="0.1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="defaultChannelFeePercentage" className="label">Default Channel Fee (%)</label>
              <input
                type="number"
                id="defaultChannelFeePercentage"
                name="defaultChannelFeePercentage"
                value={formData.defaultChannelFeePercentage}
                onChange={handleInputChange}
                className="input"
                min="0"
                step="0.1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="defaultCleaningFee" className="label">Default Cleaning Fee</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">{formData.currency}</span>
                </div>
                <input
                  type="number"
                  id="defaultCleaningFee"
                  name="defaultCleaningFee"
                  value={formData.defaultCleaningFee}
                  onChange={handleInputChange}
                  className="input pl-10"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
